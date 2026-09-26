# Project-Rumi-Next 파일·폴더 안내서

이 문서는 `Project-Rumi-Next`의 폴더와 파일이 무슨 역할을 하는지 초보자도 찾기 쉽도록 1~2줄로 정리한 문서입니다. 새 기능을 추가할 때 어느 계층을 수정해야 하는지도 마지막 절에서 설명합니다.

## 문서 범위와 상태 표시

- `사용`: 코드나 내용이 들어 있는 파일입니다. 다만 파일이 존재한다고 해서 반드시 현재 실행 경로에 등록된 것은 아닙니다.
- `빈 골격`: 향후 구현을 위해 경로만 만든 0바이트 파일입니다. 현재 기능으로 동작하지 않습니다.
- `실행 데이터`: 프로그램 실행이나 운영 과정에서 만들어지는 파일이며 Git에는 저장하지 않습니다.
- `.git/`과 `node_modules/` 내부 파일은 각각 Git과 설치된 외부 패키지가 관리하므로 개별 파일 대신 폴더 단위로 설명합니다.

## 전체 처리 흐름

`src/Main.js`가 애플리케이션을 만들고, `src/bootstrap/`이 설정·DB·서비스·명령어·이벤트·HTTP 경로·감시기를 연결합니다. Iris 웹훅은 `src/http/`에서 받은 뒤 `src/core/`와 `src/events/`를 거쳐 명령어 또는 이벤트 기능을 실행합니다.

## 폴더별 구성

아래 목록은 실제 경로 순서로 정렬되어 있습니다. 각 표에는 해당 폴더에 직접 들어 있는 파일만 표시하며, 하위 폴더는 별도 제목에서 설명합니다.

## 프로젝트 루트 (`/`)

프로젝트 설정, 설치 정보와 대표 문서가 위치합니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `.env` | 로컬 설정 | 포트와 Iris 주소 같은 실제 환경변수입니다. 비밀값이 있을 수 있어 Git에서 제외합니다. |
| `.env.example` | 사용 | 필요한 환경변수의 이름과 예시값을 안내합니다. 새 환경변수를 추가하면 함께 갱신합니다. |
| `.gitignore` | 사용 | `.env`, `data/`, 로그, `node_modules/` 등 커밋하면 안 되는 항목을 지정합니다. |
| `ecosystem.config.cjs` | 사용 | PM2로 봇을 실행할 때 사용할 프로세스 설정입니다. |
| `package.json` | 사용 | 프로젝트 정보, Node.js 버전, 실행·테스트 명령과 직접 의존성을 정의합니다. |
| `package-lock.json` | 사용 | 설치되는 npm 패키지의 정확한 버전과 의존 관계를 고정합니다. 직접 편집하지 않습니다. |
| `Project-Rumi-Next.md` | 사용 | 현재 챗봇의 목표 폴더 구조를 정리한 설계 문서입니다. |
| `README.md` | 사용 | 설치, 설정, 실행, 주요 기능과 데이터 경로를 설명하는 첫 안내 문서입니다. |

## `.git/`

커밋과 브랜치 등 Git 내부 정보를 저장합니다. 직접 수정하지 않습니다.

이 폴더의 내부 파일은 외부 도구가 관리하므로 개별 목록에서 제외합니다.

## `node_modules/`

`npm install`로 받은 외부 패키지입니다. 삭제 후 다시 설치할 수 있으며 Git에 포함하지 않습니다.

이 폴더의 내부 파일은 외부 도구가 관리하므로 개별 목록에서 제외합니다.

## `config/`

공개 예시 설정과 로컬 비밀 설정을 보관합니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `config/private.example.json` | 사용 | API 키 등 비공개 JSON 설정의 안전한 예시 형식입니다. |
| `config/private.json` | 로컬 설정 | 실제 API 키를 저장하는 로컬 파일입니다. 내용을 문서나 Git에 올리면 안 됩니다. |

## `data/`

SQLite DB, JSON, CSV, 백업과 캐시가 놓이는 실행 데이터 루트입니다.

현재 이 폴더에 직접 포함된 파일은 없습니다.

### `data/backups/`

DB 백업 파일을 둘 예정인 폴더이며 현재 비어 있습니다.

현재 이 폴더에 직접 포함된 파일은 없습니다.

### `data/cache/`

임시 캐시를 둘 예정인 폴더이며 현재 비어 있습니다.

현재 이 폴더에 직접 포함된 파일은 없습니다.

### `data/channels/`

채널 등록·대여·기능·운영자 정보를 담은 DB를 보관합니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `data/channels/ChannelLog.db` | 실행 데이터 | 채널 등록·대여·기능·방장·부방장 정보를 저장하는 SQLite DB입니다. |

### `data/db/`

대화 문장, 아이템, 마법의 답변 같은 공통 데이터를 보관합니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `data/db/BadgeItem.db` | 실행 데이터 | 레거시 배지 아이템 SQLite DB입니다. 현재 Repository는 빈 골격입니다. |
| `data/db/FoodItem.db` | 실행 데이터 | 레거시 음식 아이템 SQLite DB입니다. 현재 Repository는 빈 골격입니다. |
| `data/db/LoanItem.db` | 실행 데이터 | 레거시 대출 아이템 SQLite DB입니다. 현재 Repository는 빈 골격입니다. |
| `data/db/MagicAnswer.json` | 실행 데이터 | 마법의 답변 명령에서 무작위로 고를 문자열 목록입니다. |
| `data/db/Membership.db` | 실행 데이터 | 레거시 멤버십 SQLite DB입니다. 현재 Repository는 빈 골격입니다. |
| `data/db/Message.db` | 실행 데이터 | 호출어 대화 문장·조건·호감도 기준을 저장하는 SQLite DB입니다. |
| `data/db/TicketItem.db` | 실행 데이터 | 레거시 티켓 아이템 SQLite DB입니다. 현재 Repository는 빈 골격입니다. |

### `data/db/csv/`

레거시 데이터를 표 형태로 정리한 CSV 파일을 보관합니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `data/db/csv/BadgeItem.csv` | 실행 데이터 | 배지 아이템 데이터를 표 형태로 확인하거나 옮길 때 쓰는 CSV입니다. |
| `data/db/csv/FoodItem.csv` | 실행 데이터 | 음식 아이템 데이터를 표 형태로 확인하거나 옮길 때 쓰는 CSV입니다. |
| `data/db/csv/LoanItem.csv` | 실행 데이터 | 대출 아이템 데이터를 표 형태로 확인하거나 옮길 때 쓰는 CSV입니다. |
| `data/db/csv/MembershipItem.csv` | 실행 데이터 | 멤버십 아이템 데이터를 표 형태로 확인하거나 옮길 때 쓰는 CSV입니다. |
| `data/db/csv/Message.csv` | 실행 데이터 | 대화 문장 데이터를 표 형태로 확인하거나 옮길 때 쓰는 CSV입니다. |
| `data/db/csv/TicketItem.csv` | 실행 데이터 | 티켓 아이템 데이터를 표 형태로 확인하거나 옮길 때 쓰는 CSV입니다. |

### `data/etc/`

레코드와 설정 목록 같은 부가 JSON 데이터를 보관합니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `data/etc/RecordList.json` | 실행 데이터 | 레거시 기록 목록 JSON입니다. 현재 전용 Repository는 빈 골격입니다. |
| `data/etc/SetList.json` | 실행 데이터 | 레거시 설정 목록 JSON입니다. 현재 전용 Repository는 빈 골격입니다. |

### `data/games/`

채널 공통 게임 데이터를 보관합니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `data/games/StockData.db` | 실행 데이터 | 가상 주식의 가격·변동·갱신 시각을 저장합니다. |

### `data/users/`

사용자 계정과 사용자 활동 DB를 보관합니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `data/users/UserData.db` | 실행 데이터 | 채널별 사용자 계정·스타·권한·인벤토리를 저장합니다. |
| `data/users/UserJLLog.db` | 실행 데이터 | 채널별 사용자 입퇴장·채팅·명령·닉네임·메모 기록을 저장합니다. |

### `data/users/games/`

사용자별 출석·게임 기록 DB를 보관합니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `data/users/games/AttendanceData.db` | 실행 데이터 | 일일 출석 목록과 사용자별 출석 통계를 저장합니다. |
| `data/users/games/BeraData.db` | 실행 데이터 | 베라31 사용자별 승·패 기록을 저장합니다. |

## `docs/`

사용법, API, 배포, 문제 해결, 마이그레이션 문서를 모읍니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `docs/Architecture.md` | 사용 | 전체 구성·시작과 종료·메시지·출석과 도박·DB·감시기 메커니즘을 구조도로 설명합니다. |
| `docs/Iris-Troubleshooting.md` | 사용 | Iris 연결과 웹훅 문제를 진단하는 방법을 설명합니다. |
| `docs/Migration-Changes.md` | 사용 | 레거시 마이그레이션에서 바뀐 파일과 역할을 초보자 관점으로 정리합니다. |
| `docs/Project-Structure.md` | 사용 | 모든 폴더·파일의 역할과 새 기능 추가 절차를 정리한 현재 문서입니다. |

### `docs/assets/`

문서용 이미지 등의 자산을 둘 예정인 빈 폴더입니다.

현재 이 폴더에 직접 포함된 파일은 없습니다.

## `examples/`

최소 사용 예제 코드를 보관합니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `examples/basicBot.js` | 사용 | 애플리케이션 생성과 실행 방법을 보여 주는 간단한 예제입니다. |

## `logs/`

실행 로그를 저장할 위치이며 `.gitkeep`만 Git에 포함합니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `logs/.gitkeep` | 빈 골격 | 내용 없는 `logs/` 폴더도 Git에서 유지되도록 하는 자리표시자입니다. |

## `scripts/`

데이터 검사, 백업, 관리자 생성, 마이그레이션 같은 운영 스크립트를 둡니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `scripts/backupDatabases.js` | 빈 골격 | 향후 DB 백업 명령을 구현할 파일입니다. 현재 실행 기능은 없습니다. |
| `scripts/checkLegacyData.js` | 사용 | 레거시 DB·JSON 파일 존재 여부와 테이블 상태를 검사합니다. |

## `src/`

실제 애플리케이션 소스 코드의 루트입니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/Main.js` | 사용 | 애플리케이션 진입점입니다. 서버 시작·종료와 최종 DB 정리를 담당합니다. |

### `src/bootstrap/`

각 계층의 객체를 만들고 명령어·이벤트·라우트·감시기를 한 애플리케이션으로 조립합니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/bootstrap/createApplication.js` | 사용 | 컨테이너·Express·Bot을 만들고 명령어, 이벤트, 라우트, 감시기를 연결합니다. |
| `src/bootstrap/createContainer.js` | 사용 | 설정, Iris 클라이언트, Repository, Service를 만들고 의존성을 한 객체에 모읍니다. |
| `src/bootstrap/registerCommands.js` | 사용 | 실행할 채팅 명령어 모듈과 검사 순서를 등록합니다. 새 명령은 여기에 추가해야 합니다. |
| `src/bootstrap/registerEvents.js` | 사용 | 메시지와 입퇴장·강퇴·삭제·프로필·오류 이벤트 처리기를 등록합니다. |
| `src/bootstrap/registerRoutes.js` | 사용 | Iris 웹훅과 404·오류 미들웨어를 Express에 연결합니다. |
| `src/bootstrap/startWatchers.js` | 사용 | 역할·대여·프로필 감시기를 만들고 일괄 시작·중지합니다. |

### `src/commands/`

카카오톡 메시지와 일치하면 실행되는 명령어 모듈을 기능별로 모읍니다.

현재 이 폴더에 직접 포함된 파일은 없습니다.

### `src/commands/account/`

사용자 조회, 선택, 정보, 송금 명령어입니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/commands/account/transfer.js` | 사용 | 사용자의 스타를 다른 사용자에게 송금하는 명령입니다. |
| `src/commands/account/userInfo.js` | 사용 | 본인 계정과 보유 스타 등 사용자 정보를 보여 줍니다. |
| `src/commands/account/userLookup.js` | 사용 | 이름이나 공개 ID로 다른 사용자 계정을 찾습니다. |
| `src/commands/account/userSelection.js` | 사용 | 같은 이름의 사용자가 여러 명일 때 대상을 선택하게 합니다. |

### `src/commands/admin/`

관리자 전용 채널·사용자 관리 명령어입니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/commands/admin/_helpers.js` | 사용 | 관리자 명령에서 공통으로 쓰는 대상 사용자 선택·권한 확인 도우미입니다. |
| `src/commands/admin/adjustStar.js` | 사용 | 관리자가 사용자의 스타를 증감합니다. |
| `src/commands/admin/broadcast.js` | 사용 | 등록된 여러 채널로 공지 메시지를 전송합니다. |
| `src/commands/admin/channelId.js` | 사용 | 현재 채널의 ID를 관리자에게 보여 줍니다. |
| `src/commands/admin/channelList.js` | 사용 | 등록된 채널 목록과 상태를 조회합니다. |
| `src/commands/admin/commandHistory.js` | 사용 | 특정 사용자의 최근 명령어 기록을 조회합니다. |
| `src/commands/admin/eval.js` | 사용 | 레거시 eval 명령을 차단된 형태로 유지해 임의 JavaScript 실행을 방지합니다. |
| `src/commands/admin/registerRental.js` | 사용 | 채널의 대여 기간을 관리자 권한으로 등록·변경합니다. |
| `src/commands/admin/setAdmin.js` | 사용 | 사용자 관리자 권한을 설정하거나 해제합니다. |
| `src/commands/admin/setBan.js` | 사용 | 사용자의 차단 상태와 사유를 설정하거나 해제합니다. |
| `src/commands/admin/setWarning.js` | 사용 | 사용자의 경고 횟수를 변경합니다. |
| `src/commands/admin/starRanking.js` | 사용 | 채널의 스타 보유 순위를 보여 줍니다. |
| `src/commands/admin/userInfo.js` | 사용 | 관리자가 대상 사용자의 상세 계정 상태를 조회합니다. |
| `src/commands/admin/userList.js` | 사용 | 현재 채널의 사용자 목록을 조회합니다. |

### `src/commands/channel/`

채널 등록, 기능 설정, 멤버 기록과 메모 명령어입니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/commands/channel/channelInfo.js` | 사용 | 채널 등록·대여·기능·운영자 상태를 보여 줍니다. |
| `src/commands/channel/deleteMemberMemo.js` | 사용 | 운영자가 멤버에게 기록한 메모를 삭제합니다. |
| `src/commands/channel/featureToggle.js` | 사용 | 방장·부방장이 채널별 기능을 켜거나 끕니다. |
| `src/commands/channel/memberInfo.js` | 사용 | 멤버의 입퇴장·채팅·메모 등 채널 활동 정보를 보여 줍니다. |
| `src/commands/channel/nicknameHistory.js` | 사용 | 사용자의 이전 닉네임 기록을 보여 줍니다. |
| `src/commands/channel/previousMessage.js` | 사용 | 대상 사용자의 이전 메시지 기록을 조회합니다. |
| `src/commands/channel/requestRegistration.js` | 사용 | 방장에게 채널 등록 절차를 요청합니다. |
| `src/commands/channel/setMemberMemo.js` | 사용 | 운영자가 멤버에게 관리 메모를 저장합니다. |

### `src/commands/conversation/`

도움말, 순위, 호출어 대화, 마법의 답변 명령어입니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/commands/conversation/help.js` | 사용 | 사용할 수 있는 주요 명령어 도움말을 출력합니다. |
| `src/commands/conversation/heyRumi.js` | 사용 | 다른 명령이 일치하지 않을 때 호출어 기반 일반 대화를 처리합니다. |
| `src/commands/conversation/magicAnswer.js` | 사용 | 미리 저장된 답변 중 하나를 무작위로 돌려주는 명령입니다. |
| `src/commands/conversation/ranking.js` | 사용 | 호감도 등 사용자 순위를 보여 줍니다. |

### `src/commands/games/`

출석, 도박, 숫자야구 등 게임 명령어입니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/commands/games/attendance.js` | 사용 | 일일 출석 처리, 순위와 누적 통계를 제공합니다. |
| `src/commands/games/gambling.js` | 사용 | 스타를 걸고 확률 결과에 따라 잔액을 변경합니다. |
| `src/commands/games/numberBaseball.js` | 사용 | 사용자별 숫자야구 게임 시작·진행·종료를 처리합니다. |

### `src/commands/games/experimental/`

기본 비활성화되는 베라31·주식·끝말잇기 명령어입니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/commands/games/experimental/bera31.js` | 사용 | 베라31 게임 명령입니다. 기능 목록에서 기본 비활성화됩니다. |
| `src/commands/games/experimental/stock.js` | 사용 | 가상 주식 조회·거래 명령입니다. 기능 목록에서 기본 비활성화됩니다. |
| `src/commands/games/experimental/wordChain.js` | 사용 | 사전 검증을 사용하는 끝말잇기 명령입니다. 기능 목록에서 기본 비활성화됩니다. |

### `src/commands/system/`

상태 확인처럼 가장 기본적인 시스템 명령어입니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/commands/system/ping.js` | 사용 | DB 등록 전에 서버와 Iris 답장 경로가 살아 있는지 확인합니다. |

### `src/commands/tools/`

날씨·음악·사전 등 외부 정보 명령어입니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/commands/tools/dictionary.js` | 사용 | 한국어기초사전에서 단어 뜻을 검색합니다. |
| `src/commands/tools/music.js` | 사용 | 멜론의 음악 정보를 검색해 보여 줍니다. |
| `src/commands/tools/weather.js` | 사용 | 네이버에서 지역 날씨를 검색해 보여 줍니다. |

### `src/config/`

환경변수, 기본값, 경로, 권한, 기능 목록을 정의합니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/config/Config.js` | 사용 | 환경변수와 기본값을 읽어 애플리케이션이 쓰는 설정 객체로 만듭니다. |
| `src/config/defaults.js` | 사용 | 포트, Iris URL, 명령 접두사, 감시 주기 등 기본 설정을 정의합니다. |
| `src/config/env.js` | 사용 | `.env` 파일을 읽어 환경변수에 적용합니다. |
| `src/config/featureCatalog.js` | 사용 | 채널에서 켜고 끌 수 있는 기능명, 별칭, 기본 비활성 상태를 정의합니다. |
| `src/config/paths.js` | 사용 | 프로젝트 루트와 DB·JSON·데이터 파일의 표준 경로를 만듭니다. |
| `src/config/privateKeyLoader.js` | 사용 | `config/private.json`을 안전하게 읽고 빈 파일이나 누락을 처리합니다. |

### `src/core/`

명령 파싱·실행, 이벤트 전달, 컨텍스트 생성 등 핵심 실행 엔진입니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/core/Bot.js` | 사용 | HTTP 서버 시작·중지와 시작·종료 훅을 관리합니다. |
| `src/core/CommandManager.js` | 사용 | 명령어를 등록하고 등록 순서대로 첫 일치 명령을 실행합니다. |
| `src/core/CommandParser.js` | 사용 | 채팅 내용에서 접두사, 명령 이름과 인자를 분리합니다. |
| `src/core/ContextFactory.js` | 사용 | 한 메시지 처리에 필요한 사용자·채널·게임·도구 서비스를 `ctx`에 구성합니다. |
| `src/core/EventDetector.js` | 사용 | Iris 원본 데이터를 메시지·입장·퇴장 같은 내부 이벤트 종류로 판별합니다. |
| `src/core/EventManager.js` | 사용 | 이벤트별 처리기를 등록하고 오류 전달을 포함해 순서대로 실행합니다. |
| `src/core/ResponseCollector.js` | 빈 골격 | 향후 여러 응답을 모아 처리할 공통 객체 자리입니다. |

### `src/core/errors/`

공통 오류 형식과 코드용 폴더이며 현재 파일들은 빈 골격입니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/core/errors/AppError.js` | 빈 골격 | 향후 상태 코드와 오류 코드를 가진 애플리케이션 오류 클래스 자리입니다. |
| `src/core/errors/ErrorCodes.js` | 빈 골격 | 향후 공통 오류 코드 목록 자리입니다. |
| `src/core/errors/ErrorFormatter.js` | 빈 골격 | 향후 오류를 API·채팅 응답 형식으로 변환할 파일입니다. |

### `src/database/`

SQLite 로딩·저장·쓰기 순서 제어와 Repository 계층입니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/database/AtomicFileWriter.js` | 사용 | 임시 파일에 먼저 쓴 뒤 교체하여 SQLite 파일 저장 중 손상 위험을 줄입니다. |
| `src/database/DatabaseRegistry.js` | 사용 | 같은 DB 파일을 쓰는 여러 테이블이 하나의 메모리 DB를 공유하도록 관리합니다. |
| `src/database/DBControl.js` | 사용 | `sql.js`로 SQLite 파일을 열고 테이블 생성·조회·저장·삭제를 수행합니다. |
| `src/database/FileWriteQueue.js` | 사용 | 동일 DB 파일에 대한 비동기 쓰기를 한 번에 하나씩 실행합니다. |

### `src/database/repositories/`

봇 기능이 사용하는 DB·JSON 접근 코드를 모읍니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/database/repositories/AttendanceRepository.js` | 사용 | 일일 출석 목록과 채널별 사용자 출석 통계를 읽고 저장합니다. |
| `src/database/repositories/BeraRepository.js` | 사용 | 베라31 사용자별 승·패 기록을 읽고 저장합니다. |
| `src/database/repositories/ChannelRepository.js` | 사용 | 채널 등록·대여·기능·방장 정보를 읽고 저장합니다. |
| `src/database/repositories/MagicAnswerRepository.js` | 사용 | `MagicAnswer.json`의 답변 목록을 읽습니다. |
| `src/database/repositories/MessageRepository.js` | 사용 | `Message.db`의 대화 테이블에서 조건에 맞는 문장을 찾습니다. |
| `src/database/repositories/RecordRepository.js` | 빈 골격 | 향후 `RecordList.json` 접근을 캡슐화할 파일입니다. |
| `src/database/repositories/SettingRepository.js` | 빈 골격 | 향후 `SetList.json` 접근을 캡슐화할 파일입니다. |
| `src/database/repositories/StockRepository.js` | 사용 | 가상 주식의 가격·변동·갱신 시각을 읽고 저장합니다. |
| `src/database/repositories/UserLogRepository.js` | 사용 | 채널별 사용자 입퇴장·채팅·명령·닉네임·메모 기록을 관리합니다. |
| `src/database/repositories/UserRepository.js` | 사용 | 채널별 사용자 계정, 스타, 권한과 인벤토리를 관리합니다. |

### `src/database/repositories/items/`

아이템 DB 접근 모듈 자리이며 현재 비어 있습니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/database/repositories/items/BadgeRepository.js` | 빈 골격 | 향후 배지 아이템 DB 접근 모듈 자리입니다. |
| `src/database/repositories/items/FoodRepository.js` | 빈 골격 | 향후 음식 아이템 DB 접근 모듈 자리입니다. |
| `src/database/repositories/items/LoanRepository.js` | 빈 골격 | 향후 대출 아이템 DB 접근 모듈 자리입니다. |
| `src/database/repositories/items/MembershipRepository.js` | 빈 골격 | 향후 멤버십 아이템 DB 접근 모듈 자리입니다. |
| `src/database/repositories/items/TicketRepository.js` | 빈 골격 | 향후 티켓 아이템 DB 접근 모듈 자리입니다. |

### `src/database/schemas/`

레거시 SQLite 테이블의 열 이름과 자료형을 정의합니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/database/schemas/attendanceSchema.js` | 사용 | 출석 일일 목록과 개인 통계 테이블의 열을 정의합니다. |
| `src/database/schemas/beraSchema.js` | 사용 | 베라31 승·패 테이블의 열을 정의합니다. |
| `src/database/schemas/channelSchema.js` | 사용 | 채널 상태·대여·기능·방장·부방장 테이블의 열을 정의합니다. |
| `src/database/schemas/itemSchemas.js` | 빈 골격 | 향후 여러 아이템 테이블의 공통 스키마를 정의할 파일입니다. |
| `src/database/schemas/messageSchema.js` | 사용 | 호출어 대화 문장, 조건과 호감도 열을 정의합니다. |
| `src/database/schemas/stockSchema.js` | 사용 | 가상 주식 가격과 변동 테이블의 열을 정의합니다. |
| `src/database/schemas/userLogSchema.js` | 사용 | 사용자 활동·명령·닉네임·메모 로그의 열을 정의합니다. |
| `src/database/schemas/userSchema.js` | 사용 | 사용자 계정·권한·스타·인벤토리 열을 정의합니다. |

### `src/events/`

메시지·입퇴장·강퇴·삭제·프로필 변경 이벤트 처리기입니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/events/changeProfile.js` | 사용 | 프로필 또는 닉네임 변경을 기록하고 설정에 따라 알립니다. |
| `src/events/deleteMessage.js` | 사용 | 메시지 삭제 이벤트를 공통 조정 처리기로 전달합니다. |
| `src/events/error.js` | 사용 | 이벤트나 명령 처리 중 발생한 오류를 기록합니다. |
| `src/events/hideMessage.js` | 사용 | 메시지 가리기 이벤트를 공통 조정 처리기로 전달합니다. |
| `src/events/join.js` | 사용 | 멤버 입장 이벤트를 공통 멤버 처리기로 전달합니다. |
| `src/events/kick.js` | 사용 | 멤버 강퇴 이벤트를 공통 멤버 처리기로 전달합니다. |
| `src/events/leave.js` | 사용 | 멤버 퇴장 이벤트를 공통 멤버 처리기로 전달합니다. |
| `src/events/memberEvent.js` | 사용 | 입장·퇴장·강퇴 기록과 채널별 안내 메시지를 공통 처리합니다. |
| `src/events/message.js` | 사용 | 메시지 컨텍스트를 만들고 정책 검사, 명령 실행, 로그 저장을 진행합니다. |
| `src/events/messageModerationEvent.js` | 사용 | 삭제·가리기 이벤트의 기록과 채널별 안내 메시지를 공통 처리합니다. |

### `src/http/`

Express 서버, 미들웨어와 Iris 웹훅 경로입니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/http/createServer.js` | 사용 | Express 앱을 만들고 기본 요청 로그 및 JSON 응답 환경을 설정합니다. |

### `src/http/middleware/`

요청 파싱·인증·권한·오류 처리 등 HTTP 공통 단계를 둡니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/http/middleware/errorHandler.js` | 사용 | 처리되지 않은 HTTP 오류를 로그로 남기고 500 JSON 응답을 반환합니다. |
| `src/http/middleware/irisBigIntJsonParser.js` | 사용 | Iris 본문의 큰 숫자 ID를 정밀도 손실 없이 문자열로 파싱합니다. |
| `src/http/middleware/notFoundHandler.js` | 사용 | 등록되지 않은 URL에 404 응답을 반환합니다. |
| `src/http/middleware/requestLogger.js` | 사용 | HTTP 요청 처리 실패를 콘솔에 기록합니다. |

### `src/http/routes/`

URL과 처리기를 연결합니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/http/routes/irisWebhookRoute.js` | 사용 | `/message`로 들어온 Iris 웹훅을 파싱해 Bot 이벤트 처리로 넘깁니다. |

### `src/integrations/`

Iris와 외부 사이트/API를 호출하는 어댑터를 모읍니다.

현재 이 폴더에 직접 포함된 파일은 없습니다.

### `src/integrations/dictionary/`

한국어기초사전 API 연동 코드입니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/integrations/dictionary/KoreanDictionaryClient.js` | 사용 | 한국어기초사전 API 요청과 응답 파싱을 담당합니다. |

### `src/integrations/gemma/`

Gemma 명령 분석 서버 연동 코드입니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/integrations/gemma/GemmaClient.js` | 사용 | Gemma 기반 명령 분석 HTTP 요청을 담당하지만 현재 기본 컨테이너에는 연결되지 않습니다. |

### `src/integrations/iris/`

Iris의 웹훅 데이터, DB 질의, 답장 API를 처리합니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/integrations/iris/IrisClient.js` | 사용 | Iris 기본 URL과 제한 시간을 적용하는 공통 HTTP 클라이언트입니다. |
| `src/integrations/iris/IrisDataMapper.js` | 사용 | Iris DB 행을 내부 사용자·채널 형태로 안전하게 변환합니다. |
| `src/integrations/iris/IrisEventParser.js` | 사용 | Iris 웹훅을 메시지·멤버·삭제·프로필 내부 이벤트로 변환합니다. |
| `src/integrations/iris/IrisGateway.js` | 사용 | `chat_logs`, `open_chat_member` 등 Iris DB 질의를 기능 단위로 제공합니다. |
| `src/integrations/iris/IrisQueryClient.js` | 사용 | Iris `/query`에 `{ query, bind }` 형식으로 SQL 요청을 보냅니다. |
| `src/integrations/iris/IrisReplyClient.js` | 사용 | Iris `/reply`로 채널 텍스트 답장을 보냅니다. |

### `src/integrations/music/`

멜론 음악 정보 연동 코드입니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/integrations/music/MelonClient.js` | 사용 | 멜론 페이지에서 음악 검색 결과를 가져옵니다. |

### `src/integrations/weather/`

네이버 날씨 정보 연동 코드입니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/integrations/weather/NaverWeatherClient.js` | 사용 | 네이버 페이지에서 지역별 날씨 결과를 가져옵니다. |

### `src/presenters/`

내부 데이터를 API JSON 또는 채팅 문장으로 변환합니다.

현재 이 폴더에 직접 포함된 파일은 없습니다.

### `src/presenters/chat/`

사용자·채널·출석·오류 정보를 채팅용 문장으로 만듭니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/presenters/chat/attendancePresenter.js` | 빈 골격 | 향후 출석 결과 문장 생성을 Service에서 분리할 파일입니다. |
| `src/presenters/chat/channelInfoPresenter.js` | 사용 | 채널 정보 객체를 읽기 쉬운 채팅 문장으로 만듭니다. |
| `src/presenters/chat/errorPresenter.js` | 빈 골격 | 향후 오류를 사용자용 채팅 문장으로 변환할 파일입니다. |
| `src/presenters/chat/userInfoPresenter.js` | 사용 | 사용자 계정 정보를 읽기 쉬운 채팅 문장으로 만듭니다. |

### `src/services/`

명령어와 이벤트가 호출하는 업무 규칙을 기능별로 모읍니다.

현재 이 폴더에 직접 포함된 파일은 없습니다.

### `src/services/account/`

사용자 계정 생성·조회·선택·송금 규칙입니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/services/account/TransferService.js` | 사용 | 송금 금액과 잔액을 검증하고 보내는 사람·받는 사람의 스타를 변경합니다. |
| `src/services/account/UserLookupService.js` | 사용 | 공개 ID나 이름으로 사용자를 찾고 중복 결과를 정리합니다. |
| `src/services/account/UserSelectionService.js` | 사용 | 중복 이름 조회 뒤 사용자의 후속 선택 상태를 관리합니다. |
| `src/services/account/UserService.js` | 사용 | 현재 채널·사용자 범위에서 계정 생성, 조회와 값 변경을 제공합니다. |

### `src/services/admin/`

방송, 사용자 제재, 채널 관리 규칙입니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/services/admin/BroadcastService.js` | 사용 | 방송 대상 채널을 골라 Iris 답장을 순차 전송합니다. |
| `src/services/admin/ChannelAdminService.js` | 사용 | 관리자용 채널 목록·삭제·대여 변경 규칙을 제공합니다. |
| `src/services/admin/UserAdminService.js` | 사용 | 관리자 권한, 차단, 경고, 스타 조정 규칙을 제공합니다. |

### `src/services/channel/`

채널 등록·권한·대여·기능·멤버 메모 규칙입니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/services/channel/ChannelExecutionPolicy.js` | 사용 | 채널 등록·대여·기능 상태를 기준으로 명령 실행 가능 여부를 판단합니다. |
| `src/services/channel/ChannelFeatureService.js` | 사용 | 채널 기능 JSON을 읽고 기능별 활성 상태를 변경합니다. |
| `src/services/channel/ChannelRegistrationService.js` | 사용 | 방장 권한과 요청 채널을 확인해 채널 등록 절차를 수행합니다. |
| `src/services/channel/ChannelRoleService.js` | 사용 | 방장·부방장 ID를 문자열과 JSON 배열로 저장·동기화합니다. |
| `src/services/channel/ChannelService.js` | 사용 | 채널 조회, 기본 레코드 생성과 저장을 제공합니다. |
| `src/services/channel/MemberMemoService.js` | 사용 | 사용자 로그에 운영자 메모를 저장·삭제합니다. |
| `src/services/channel/RentalService.js` | 사용 | 채널 대여 만료 여부와 남은 기간을 계산합니다. |

### `src/services/conversation/`

호출어 대화, 마법의 답변, 순위 규칙입니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/services/conversation/ConversationService.js` | 사용 | 메시지 DB 조건과 사용자 호감도에 맞는 호출어 답변을 고릅니다. |
| `src/services/conversation/MagicAnswerService.js` | 사용 | 마법의 답변 목록에서 임의의 결과를 선택합니다. |
| `src/services/conversation/RankingService.js` | 사용 | 사용자 데이터를 기준으로 호감도 등의 순위를 계산합니다. |

### `src/services/games/`

출석·도박·숫자야구·베라31·주식·끝말잇기 규칙입니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/services/games/AttendanceService.js` | 사용 | 중복 출석을 막고 당일 순위·누적 횟수·보상을 계산합니다. |
| `src/services/games/Bera31Service.js` | 사용 | 채널별 베라31 진행 상태와 사용자 승패·스타 보상을 관리합니다. |
| `src/services/games/GamblingService.js` | 사용 | 베팅 가능 금액과 확률 결과를 계산해 스타를 반영합니다. |
| `src/services/games/NumberBaseballService.js` | 사용 | 사용자별 정답 숫자와 시도 상태를 메모리에서 관리합니다. |
| `src/services/games/StockService.js` | 사용 | 가상 주식 가격 변동, 거래 가능 시간과 매매 결과를 처리합니다. |
| `src/services/games/WordChainService.js` | 사용 | 채널별 끝말잇기 상태, 단어 중복과 사전 유효성을 검사합니다. |

### `src/services/logging/`

메시지, 명령어, 닉네임과 멤버 활동 기록 규칙입니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/services/logging/CommandLogService.js` | 사용 | 실행한 명령과 결과 설명을 제한된 길이로 기록합니다. |
| `src/services/logging/MemberHistoryService.js` | 사용 | 입장·퇴장·강퇴 시각 등 멤버 이력을 기록합니다. |
| `src/services/logging/MessageLogService.js` | 사용 | 최근 채팅 내용과 채팅 횟수를 사용자 로그에 반영합니다. |
| `src/services/logging/NicknameHistoryService.js` | 사용 | 닉네임 변경 내역을 중복 없이 제한된 길이로 저장합니다. |
| `src/services/logging/UserLogService.js` | 사용 | 현재 사용자의 로그 레코드 생성과 세부 로그 서비스 호출을 묶습니다. |

### `src/services/tools/`

날씨·음악·사전과 명령 분석 결과를 정리합니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/services/tools/CommandAnalysisService.js` | 사용 | Gemma 분석 결과를 명령 실행에 쓸 형태로 정리하지만 현재 기본 컨테이너에는 연결되지 않습니다. |
| `src/services/tools/DictionaryService.js` | 사용 | 사전 검색 결과를 사용자용 설명 문장으로 정리합니다. |
| `src/services/tools/MusicService.js` | 사용 | 음악 검색 결과를 사용자용 문장으로 정리합니다. |
| `src/services/tools/WeatherService.js` | 사용 | 날씨 검색 결과를 사용자용 문장으로 정리합니다. |

### `src/utils/`

여러 계층에서 재사용하는 작은 도우미를 둡니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/utils/CommandUtils.js` | 사용 | 명령 문자열 정규화, 별칭 일치와 정수 파싱을 제공합니다. |
| `src/utils/dateTime.js` | 사용 | 날짜 포맷과 날짜 계산에 쓰는 공통 함수를 제공합니다. |
| `src/utils/koreanJosa.js` | 사용 | 받침 여부에 맞는 한국어 조사를 선택합니다. |
| `src/utils/logger.js` | 빈 골격 | 향후 구조화 로그를 제공할 공통 로거 자리입니다. |
| `src/utils/mention.js` | 빈 골격 | 향후 멘션 데이터 생성·해석 도우미 자리입니다. |
| `src/utils/number.js` | 빈 골격 | 향후 숫자 검증·표시 도우미 자리입니다. |
| `src/utils/random.js` | 사용 | 범위 정수와 배열 요소 무작위 선택을 제공합니다. |

### `src/watchers/`

일정 간격으로 역할·대여·프로필 상태를 동기화합니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `src/watchers/ChannelRoleWatcher.js` | 사용 | Iris의 방장·부방장 상태를 묶음 조회해 채널 DB와 주기적으로 동기화합니다. |
| `src/watchers/ProfileWatcher.js` | 사용 | Iris 프로필 스냅샷을 비교해 변경 이벤트를 발생시킵니다. |
| `src/watchers/RentNoticeWatcher.js` | 사용 | 대여 만료 임박·만료 채널을 검사해 안내하고 중복 실행을 막습니다. |

## `tests/`

통합·보안·단위 테스트와 테스트 데이터를 둡니다.

현재 이 폴더에 직접 포함된 파일은 없습니다.

### `tests/fixtures/`

테스트 입력 샘플을 둘 예정인 빈 폴더입니다.

현재 이 폴더에 직접 포함된 파일은 없습니다.

### `tests/integration/`

HTTP·Iris·DB·명령어를 여러 계층과 함께 확인합니다.

| 파일 | 상태 | 설명 |
|---|---|---|
| `tests/integration/attendanceGambling.test.js` | 사용 | 출석 보상·순위·재시작 보존과 도박 배당·잘못된 금액·기능 비활성을 검증합니다. |
| `tests/integration/botShutdown.test.js` | 사용 | Iris 응답이 멈춰도 종료 시 HTTP 포트가 해제되는지 확인합니다. |
| `tests/integration/databaseQueue.test.js` | 빈 골격 | 향후 DB 쓰기 큐의 동시성 통합 테스트 자리입니다. |
| `tests/integration/irisEnvelope.test.js` | 사용 | 구형 Iris 봉투와 암호화 메시지 조회 순서를 확인합니다. |
| `tests/integration/irisTimeout.test.js` | 사용 | Iris 질의·답장·응답 본문 제한 시간이 동작하는지 확인합니다. |
| `tests/integration/irisWebhook.test.js` | 빈 골격 | 향후 Iris 웹훅 전용 통합 테스트 자리입니다. |
| `tests/integration/legacyFeatures.test.js` | 사용 | 대여·기능 제어·사용자 선택·멤버 이벤트·게임·공유 DB를 함께 검증합니다. |
| `tests/integration/migrationCommands.test.js` | 사용 | 마이그레이션된 계정·출석·송금 명령이 레거시 데이터와 호환되는지 확인합니다. |
| `tests/integration/ping.test.js` | 사용 | 실제 HTTP 웹훅→ping→Iris 답장과 큰 ID 보존, 실패 노출을 확인합니다. |

### `tests/unit/`

작은 모듈 단위 테스트를 둘 예정인 상위 빈 폴더입니다.

현재 이 폴더에 직접 포함된 파일은 없습니다.

### `tests/unit/commands/`

명령어 단위 테스트의 상위 빈 폴더입니다.

현재 이 폴더에 직접 포함된 파일은 없습니다.

### `tests/unit/commands/account/`

계정 명령 단위 테스트용 빈 폴더입니다.

현재 이 폴더에 직접 포함된 파일은 없습니다.

### `tests/unit/commands/admin/`

관리자 명령 단위 테스트용 빈 폴더입니다.

현재 이 폴더에 직접 포함된 파일은 없습니다.

### `tests/unit/commands/channel/`

채널 명령 단위 테스트용 빈 폴더입니다.

현재 이 폴더에 직접 포함된 파일은 없습니다.

### `tests/unit/commands/conversation/`

대화 명령 단위 테스트용 빈 폴더입니다.

현재 이 폴더에 직접 포함된 파일은 없습니다.

### `tests/unit/commands/games/`

게임 명령 단위 테스트용 빈 폴더입니다.

현재 이 폴더에 직접 포함된 파일은 없습니다.

### `tests/unit/commands/system/`

시스템 명령 단위 테스트용 빈 폴더입니다.

현재 이 폴더에 직접 포함된 파일은 없습니다.

### `tests/unit/commands/tools/`

도구 명령 단위 테스트용 빈 폴더입니다.

현재 이 폴더에 직접 포함된 파일은 없습니다.

### `tests/unit/core/`

핵심 엔진 단위 테스트용 빈 폴더입니다.

현재 이 폴더에 직접 포함된 파일은 없습니다.

### `tests/unit/database/`

DB 계층 단위 테스트용 빈 폴더입니다.

현재 이 폴더에 직접 포함된 파일은 없습니다.

### `tests/unit/middleware/`

HTTP 미들웨어 단위 테스트용 빈 폴더입니다.

현재 이 폴더에 직접 포함된 파일은 없습니다.

### `tests/unit/presenters/`

Presenter 단위 테스트용 빈 폴더입니다.

현재 이 폴더에 직접 포함된 파일은 없습니다.

### `tests/unit/repositories/`

Repository 단위 테스트용 빈 폴더입니다.

현재 이 폴더에 직접 포함된 파일은 없습니다.

### `tests/unit/services/`

Service 단위 테스트용 빈 폴더입니다.

현재 이 폴더에 직접 포함된 파일은 없습니다.

## 새 기능을 추가하는 방법

### 1. 새 채팅 명령어

1. 기능에 맞는 `src/commands/<분류>/새명령.js`를 만들고 `name`, `matches(ctx)`, `execute(ctx)`를 내보냅니다.
2. 업무 규칙이 길거나 DB·외부 API를 사용한다면 명령 파일에 모두 넣지 말고 `src/services/`에 Service를 만듭니다.
3. 새 의존성이 필요하면 `src/bootstrap/createContainer.js`에서 한 번 만들고, 메시지마다 필요한 기능이면 `src/core/ContextFactory.js`의 `ctx`에 연결합니다.
4. `src/bootstrap/registerCommands.js`에 명령을 등록합니다. 먼저 등록된 명령이 먼저 검사되므로 넓게 일치하는 명령은 뒤에 둡니다.
5. 채널에서 켜고 끌 기능이면 `src/config/featureCatalog.js`에 키·별칭·표시 이름을 추가하고 명령에서 실행 정책을 확인합니다.
6. 정상 입력, 잘못된 입력, 권한 부족과 기능 비활성 상태를 테스트한 뒤 도움말과 README를 갱신합니다.

최소 형태는 다음과 같습니다.

```js
module.exports = {
  name: "sample",
  matches: ctx => ctx.hasPrefix && ctx.command === "sample",
  async execute(ctx) {
    await ctx.send("샘플 기능입니다.");
  },
};
```

### 2. 새 이벤트

1. Iris 원본 형식이 새롭다면 `src/integrations/iris/IrisEventParser.js`와 `src/core/EventDetector.js`에서 내부 이벤트로 변환합니다.
2. `src/events/새이벤트.js`에 처리기를 만들고, 복잡한 기록·판단은 Service로 분리합니다.
3. `src/bootstrap/registerEvents.js`에 이벤트 이름과 처리기를 등록합니다.
4. 큰 카카오톡 ID는 `Number`로 바꾸지 말고 문자열로 유지하며, 실제와 같은 웹훅 샘플로 테스트합니다.

### 3. 새 DB 기능

1. 저장할 값의 스키마를 `src/database/schemas/`에 정의합니다.
2. SQL과 파일 경로를 명령어에서 직접 다루지 말고 `src/database/repositories/`에 Repository를 만듭니다.
3. `src/config/paths.js`에 표준 경로를 추가하고 `src/bootstrap/createContainer.js`에서 `DatabaseRegistry`를 통해 Repository를 생성합니다.
4. 같은 SQLite 파일의 여러 테이블은 반드시 같은 Registry를 사용해야 하며, 저장은 기존 `DBControl`과 쓰기 큐를 거쳐야 합니다.
5. 기존 DB에 열을 추가할 때는 기본값·구버전 데이터 호환과 재시작 후 보존 여부를 테스트합니다. 운영 DB를 시험에 직접 사용하지 말고 임시 `RUMI_DATA_PATH`를 사용합니다.

### 4. 새 외부 API 연동

1. HTTP 요청과 응답 파싱은 `src/integrations/<서비스>/`의 Client에 둡니다.
2. 사용자에게 보여 줄 판단과 결과 정리는 `src/services/tools/` 같은 Service에 둡니다.
3. API 키는 코드에 쓰지 말고 `config/private.json` 또는 환경변수로 읽으며, `config/private.example.json`에는 값 없이 키 이름만 추가합니다.
4. 제한 시간, 비정상 응답, 인증 실패를 처리하고 네트워크 없이 실행하는 테스트에서는 Client를 가짜 객체로 교체합니다.

### 5. 감시기 또는 주기 작업

1. `src/watchers/`에 `start()`와 `stop()`을 가진 클래스를 만들고, 같은 작업이 겹쳐 실행되지 않도록 실행 중 잠금 값을 둡니다.
2. `src/bootstrap/startWatchers.js`에 추가해 봇 시작·종료와 수명을 맞춥니다.
3. 정상적으로 데이터가 없는 경우와 Iris/API 요청 실패를 구분하고, 실패했다고 기존 정상 데이터를 지우지 않습니다.

## 변경 후 확인 목록

- 새 모듈을 만들기만 하고 `registerCommands`, `registerEvents`, `registerRoutes`, `startWatchers` 또는 `createContainer` 등록을 빼먹지 않았는가?
- 사용자 입력, 권한, 채널 기능 활성 여부와 대여 만료를 검사했는가?
- 카카오톡의 큰 ID를 문자열로 보존했는가?
- 비밀키와 실제 DB·로그 파일이 Git에 포함되지 않았는가?
- 오류가 조용히 사라지지 않고 로그 또는 사용자 응답으로 드러나는가?
- 종료 시 타이머·서버·DB가 올바른 순서로 정리되는가?
- `npm test`와 `git diff --check`를 통과했는가?
- `README.md`, 관련 `docs/` 문서와 이 파일의 목록을 갱신했는가?
