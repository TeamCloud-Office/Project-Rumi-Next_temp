# Project-Rumi-Next 메커니즘 구조도

현재 실행 코드 기준입니다. GitHub 또는 Mermaid를 지원하는 Markdown 미리보기에서 구조도를 볼 수 있습니다. 박스는 역할별 모듈이며, Next 내부 모듈들은 하나의 Node.js 프로세스에서 실행됩니다.

## 1. 전체 구성

```mermaid
flowchart LR
    chat["카카오톡 채팅"] <-->|"메시지 수신과 전송"| iris["Iris"]
    subgraph nextApp ["Project-Rumi-Next · Node.js 프로세스"]
        webhook["Express · POST /message"]
        parser["IrisEventParser · 이벤트 변환"]
        events["Bot → EventManager"]
        handlers["메시지 및 멤버 이벤트 처리기"]
        services["명령어와 Service · 업무 처리"]
        repos["Repository · 데이터 접근"]
        storage["DBControl · sql.js · 저장 큐"]
        reply["IrisReplyClient"]
        query["IrisGateway → IrisQueryClient"]
    end
    iris -->|"웹훅 전달"| webhook
    webhook --> parser --> events --> handlers --> services
    services --> repos --> storage
    storage -->|"읽기 및 저장"| files[("로컬 SQLite 파일")]
    services -->|"결과 전송"| reply
    reply -->|"POST /reply"| iris
    parser -.->|"필요할 때 원문 조회"| query
    query -->|"POST /query"| iris
    services -.->|"날씨·음악·사전 조회"| external["외부 서비스"]
```

Iris의 메시지·멤버 DB는 `/query`로 조회합니다. 사용자 스타와 출석 기록을 저장하는 Next의 로컬 SQLite DB와는 별개입니다. 현재 등록된 계정·채널·게임·도구·대화 명령은 모두 같은 처리 경로를 사용합니다.

## 2. 시작과 종료

```mermaid
flowchart LR
    main["Main.js · 환경설정 로드"] --> app["createApplication"]
    app --> container["createContainer · DB와 Service 생성"]
    container --> registration["명령어·이벤트·웹훅 등록"]
    registration --> hooks["감시기 시작·중지 훅 등록"]
    hooks --> start["Bot.start · HTTP 서버 시작"]
    start --> watchers["감시기 시작"]
    signal["SIGINT 또는 SIGTERM"] --> stop["Bot.stop · 서버 종료 처리"]
    stop --> stopWatchers["감시기 중지"]
    stopWatchers --> closeDb["DatabaseRegistry.close"]
    closeDb --> exitProcess["프로세스 종료"]
```

`createContainer`는 공유 Repository와 클라이언트를 구성하고, `ContextFactory`는 메시지마다 사용자·채널에 맞는 서비스를 묶습니다. 서버 종료 시 진행 중 요청을 기다리되 제한 시간을 넘긴 연결은 닫고, 감시기와 DB를 정리합니다.

## 3. 메시지 하나가 처리되는 순서

```mermaid
flowchart TD
    receive["POST /message"] --> json["큰 숫자 ID를 문자열로 파싱"]
    json --> parse["IrisEventParser · 메시지 또는 멤버 이벤트 판별"]
    parse --> kind{"메시지 이벤트인가?"}
    kind -->|"아니오"| member["입장·퇴장·강퇴·삭제·프로필 처리기"]
    kind -->|"예"| context["ContextFactory · 접두사 분석과 ctx 생성"]
    context --> ping{"접두사가 있는 ping 또는 핑인가?"}
    ping -->|"예"| pingReply["사용자·채널 등록과 로그 준비를 건너뛰고 응답"]
    ping -->|"아니오"| prepare["채널·사용자·로그 준비 및 차단 상태 조회"]
    prepare --> banned{"차단된 사용자인가?"}
    banned -->|"예"| block["명령 시도 시 차단 안내"]
    banned -->|"아니오"| match["CommandManager · 등록 순서대로 matches 검사"]
    match --> execute["첫 일치 명령의 execute 실행"]
    execute --> policy["명령별 대여·기능·권한 검사"]
    policy --> service["Service 처리 후 ctx.send로 응답"]
    service --> log["메시지와 명령 결과 기록"]
    block --> messageLog["메시지 기록"]
```

등록 순서는 `registerCommands.js`에 있습니다. 첫 일치 명령만 실행하며, 일반 대화 명령은 마지막에 검사합니다. 대여·기능 검사는 명령별로 수행하므로 모든 명령이 동일한 정책을 적용하는 것은 아닙니다.

잘못된 웹훅은 HTTP 400, 처리할 이벤트가 없는 정상 입력은 200으로 끝납니다. 명령 실행 오류는 채팅 안내와 로그로 처리하고, 상위로 전파된 오류는 HTTP 오류 처리기를 거칩니다. 그림은 정상 처리의 주요 경로를 나타냅니다.

## 4. 출석 체크와 도박

```mermaid
flowchart LR
    command["등록된 게임 명령"] --> gate["채널 활성 상태와 해당 기능 확인"]
    gate --> attendance["AttendanceService"]
    gate --> gambling["GamblingService"]
    attendance --> daily["한국 날짜 기준 중복 출석 확인"]
    daily --> attendanceRepo["AttendanceRepository · 순위와 누적 기록"]
    attendanceRepo --> attendanceDb[("AttendanceData.db")]
    attendanceRepo -->|"출석 성공 시 100스타"| user["UserService.addStar"]
    gambling --> wager["대상·금액·보유 스타 검증"]
    wager --> outcome["무작위 결과와 순이익 계산"]
    outcome -->|"승패에 따른 잔액 변경"| user
    user --> userRepo["UserRepository"]
    userRepo --> userDb[("UserData.db")]
```

출석은 채널별로 당일 사용자 목록, 개인별 누적 횟수·당일 순위·1등 횟수를 저장합니다. 목록 및 내 출석 조회는 보상을 지급하지 않습니다.

흑백 도박은 승리 시 베팅액의 1배, 숫자 도박은 3배가 순이익입니다. 패배 시 베팅액을 잃습니다. 기존 `도박 100` 간편 명령은 45% 승률이며 순이익은 베팅액과 같습니다. 도박 전용 DB는 없고 결과 잔액을 사용자 DB에 저장합니다.

## 5. DB 저장 메커니즘

```mermaid
flowchart LR
    repo["Repository"] --> registry["DatabaseRegistry · 파일별 공유 인스턴스"]
    registry --> control["DBControl · 테이블 접근"]
    disk[("기존 SQLite 파일")] -->|"최초 로드"| memory["sql.js 메모리 DB"]
    control -->|"조회·변경"| memory
    control -->|"persist 요청"| queue["FileWriteQueue · 파일별 순차 저장"]
    memory -->|"큐 실행 시 export"| snapshot["DB 전체 스냅샷"]
    queue --> snapshot
    snapshot --> writer["AtomicFileWriter · 임시 파일 작성"]
    writer -->|"rename으로 교체"| disk
```

같은 파일의 여러 테이블은 하나의 메모리 DB를 공유합니다. 쓰기 큐는 파일 저장 순서를 제어하며, 출석 기록과 스타 지급처럼 여러 동작을 하나의 트랜잭션으로 묶는 장치는 아닙니다. 현재 구조는 단일 프로세스 운영을 전제로 합니다.

| 저장소 | 역할 |
|---|---|
| `data/users/UserData.db` | 계정·스타·권한·인벤토리 |
| `data/users/UserJLLog.db` | 메시지·명령·닉네임·멤버 기록 |
| `data/channels/ChannelJLLog.db` | 채널·대여·기능·방장·부방장 |
| `data/users/games/AttendanceData.db` | 출석 목록과 개인 통계 |
| `data/users/games/BeraData.db` | 베라31 승패 |
| `data/games/StockData.db` | 가상 주식 가격 |
| `data/db/Message.db` | 호출어 대화 데이터 |
| `data/db/MagicAnswer.json` | 마법의 답변 목록, SQLite가 아닌 JSON |

## 6. 주기 작업

```mermaid
flowchart LR
    timer["startWatchers · 설정된 주기"] --> roles["ChannelRoleWatcher"]
    timer --> profile["ProfileWatcher"]
    timer --> rent["RentNoticeWatcher"]
    roles -->|"방장·부방장 조회"| iris["IrisGateway · POST /query"]
    roles -->|"변경 반영"| channel[("ChannelJLLog.db")]
    profile -->|"멤버 프로필 조회"| iris
    profile -->|"스냅샷 비교 후 변경 알림"| events["EventManager · changeProfile"]
    events --> handler["프로필 기록과 채널 안내"]
    rent -->|"대여 상태 확인"| channel
    rent -->|"만료 관련 안내"| reply["IrisReplyClient · POST /reply"]
```

감시기는 채팅 명령이 없어도 실행됩니다. 각 감시기의 실행 중 표시로 같은 작업의 중첩을 막고, 봇 종료 시 타이머를 해제합니다.

## 코드 찾아보기

- 시작 및 조립: [Main.js](../src/Main.js), [createApplication.js](../src/bootstrap/createApplication.js), [createContainer.js](../src/bootstrap/createContainer.js)
- 웹훅 및 메시지: [irisWebhookRoute.js](../src/http/routes/irisWebhookRoute.js), [ContextFactory.js](../src/core/ContextFactory.js), [message.js](../src/events/message.js)
- 명령 등록: [registerCommands.js](../src/bootstrap/registerCommands.js)
- DB 및 감시기: [DatabaseRegistry.js](../src/database/DatabaseRegistry.js), [startWatchers.js](../src/bootstrap/startWatchers.js)
- 전체 파일 설명: [Project-Structure.md](Project-Structure.md)
