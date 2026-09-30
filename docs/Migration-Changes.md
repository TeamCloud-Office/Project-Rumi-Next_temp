# Project-Rumi-Next 변경 파일 요약

작성일: 2026-09-20

레거시 마이그레이션을 위해 변경한 주요 파일을 한 줄씩 정리했습니다.

## 프로젝트 설정 — 6개

| 파일 | 역할 |
|---|---|
| [.env.example](../.env.example) | Iris, 운영 채널, 감시 주기 환경 변수 예시를 제공합니다. |
| [README.md](../README.md) | 현재 설치법, 명령어, 권한과 운영 제한을 설명합니다. |
| [config/private.example.json](../config/private.example.json) | 사전·Gemma API 키 형식을 보여 줍니다. |
| [package.json](../package.json) | 실행·테스트 명령과 의존성을 정의합니다. |
| [package-lock.json](../package-lock.json) | 설치 패키지 버전을 고정합니다. |
| [scripts/checkLegacyData.js](../scripts/checkLegacyData.js) | 레거시 데이터 파일과 테이블 상태를 검사합니다. |

## 시작과 등록 — 5개

| 파일 | 역할 |
|---|---|
| [src/bootstrap/createApplication.js](../src/bootstrap/createApplication.js) | 서버, 이벤트, 명령, 감시 작업을 하나의 앱으로 조립합니다. |
| [src/bootstrap/createContainer.js](../src/bootstrap/createContainer.js) | 저장소·서비스·외부 API 객체를 생성합니다. |
| [src/bootstrap/registerCommands.js](../src/bootstrap/registerCommands.js) | 이관된 명령어를 실행 순서대로 등록합니다. |
| [src/bootstrap/registerEvents.js](../src/bootstrap/registerEvents.js) | 메시지와 입퇴장·삭제·프로필 이벤트를 등록합니다. |
| [src/bootstrap/startWatchers.js](../src/bootstrap/startWatchers.js) | 역할·대여·프로필 감시 작업을 시작하고 종료합니다. |

## 계정 명령 — 4개

| 파일 | 역할 |
|---|---|
| [src/commands/account/transfer.js](../src/commands/account/transfer.js) | 여러 레거시 문장 형식의 스타 송금을 처리합니다. |
| [src/commands/account/userInfo.js](../src/commands/account/userInfo.js) | 내 계정 정보를 표시합니다. |
| [src/commands/account/userLookup.js](../src/commands/account/userLookup.js) | 채널별 사용자 검색과 명령 기록 조회를 처리합니다. |
| [src/commands/account/userSelection.js](../src/commands/account/userSelection.js) | 동명이인 검색 뒤 번호 선택을 처리합니다. |

## 관리자 명령 — 14개

| 파일 | 역할 |
|---|---|
| [src/commands/admin/_helpers.js](../src/commands/admin/_helpers.js) | 관리자 확인, 대상 조회, 숫자 변환을 공통 처리합니다. |
| [src/commands/admin/adjustStar.js](../src/commands/admin/adjustStar.js) | 사용자의 스타를 지급하거나 회수합니다. |
| [src/commands/admin/broadcast.js](../src/commands/admin/broadcast.js) | 등록된 전체 채널로 공지를 전송합니다. |
| [src/commands/admin/channelId.js](../src/commands/admin/channelId.js) | 현재 채널 ID를 알려 줍니다. |
| [src/commands/admin/channelList.js](../src/commands/admin/channelList.js) | 채널 대여·방장·메모 상태를 나열합니다. |
| [src/commands/admin/commandHistory.js](../src/commands/admin/commandHistory.js) | 지정 사용자의 명령 기록을 조회합니다. |
| [src/commands/admin/eval.js](../src/commands/admin/eval.js) | 레거시 eval 입력을 감지하되 임의 코드는 실행하지 않습니다. |
| [src/commands/admin/registerRental.js](../src/commands/admin/registerRental.js) | 채널 대여 기간을 등록합니다. |
| [src/commands/admin/setAdmin.js](../src/commands/admin/setAdmin.js) | 사용자 관리자 권한을 변경합니다. |
| [src/commands/admin/setBan.js](../src/commands/admin/setBan.js) | 사용자 밴과 사유를 설정하거나 해제합니다. |
| [src/commands/admin/setWarning.js](../src/commands/admin/setWarning.js) | 사용자 경고 횟수를 설정합니다. |
| [src/commands/admin/starRanking.js](../src/commands/admin/starRanking.js) | 지정 채널의 전체 스타 순위를 표시합니다. |
| [src/commands/admin/userInfo.js](../src/commands/admin/userInfo.js) | 다른 채널의 사용자 정보를 조회합니다. |
| [src/commands/admin/userList.js](../src/commands/admin/userList.js) | 지정 채널의 사용자 로그 목록을 표시합니다. |

## 채널·방장 명령 — 8개

| 파일 | 역할 |
|---|---|
| [src/commands/channel/channelInfo.js](../src/commands/channel/channelInfo.js) | 대여 기간과 기능 상태를 표시합니다. |
| [src/commands/channel/deleteMemberMemo.js](../src/commands/channel/deleteMemberMemo.js) | 사용자 운영 메모를 삭제합니다. |
| [src/commands/channel/featureToggle.js](../src/commands/channel/featureToggle.js) | 방장이 기능을 켜거나 끕니다. |
| [src/commands/channel/memberInfo.js](../src/commands/channel/memberInfo.js) | 답장 또는 이름으로 멤버 정보와 기록을 조회합니다. |
| [src/commands/channel/nicknameHistory.js](../src/commands/channel/nicknameHistory.js) | 멤버의 닉네임 변경 기록을 표시합니다. |
| [src/commands/channel/previousMessage.js](../src/commands/channel/previousMessage.js) | 답장한 메시지의 이전 내용을 표시합니다. |
| [src/commands/channel/requestRegistration.js](../src/commands/channel/requestRegistration.js) | 방장의 채널 등록 신청을 운영 채널로 전달합니다. |
| [src/commands/channel/setMemberMemo.js](../src/commands/channel/setMemberMemo.js) | 멤버 운영 메모를 저장합니다. |

## 대화·게임·도구 명령 — 13개

| 파일 | 역할 |
|---|---|
| [src/commands/conversation/help.js](../src/commands/conversation/help.js) | 현재 명령어 도움말을 표시합니다. |
| [src/commands/conversation/heyRumi.js](../src/commands/conversation/heyRumi.js) | 다른 명령이 없을 때 Message.db 대화를 처리합니다. |
| [src/commands/conversation/magicAnswer.js](../src/commands/conversation/magicAnswer.js) | 호출어 없는 마법 답변 명령을 처리합니다. |
| [src/commands/conversation/ranking.js](../src/commands/conversation/ranking.js) | 현재 채널의 상위 스타 순위를 표시합니다. |
| [src/commands/games/attendance.js](../src/commands/games/attendance.js) | 출석·출석 목록·개인 기록을 처리합니다. |
| [src/commands/games/gambling.js](../src/commands/games/gambling.js) | 단순 도박과 흑백·숫자 배팅을 처리합니다. |
| [src/commands/games/numberBaseball.js](../src/commands/games/numberBaseball.js) | 숫자야구 시작·추측·종료를 처리합니다. |
| [src/commands/games/experimental/bera31.js](../src/commands/games/experimental/bera31.js) | 베라31 참가·시작·숫자 입력·랭킹을 처리합니다. |
| [src/commands/games/experimental/stock.js](../src/commands/games/experimental/stock.js) | 가상 주식 목록·구매·판매를 처리합니다. |
| [src/commands/games/experimental/wordChain.js](../src/commands/games/experimental/wordChain.js) | 끝말잇기 참가·시작·단어 입력을 처리합니다. |
| [src/commands/tools/dictionary.js](../src/commands/tools/dictionary.js) | 여러 자연어 형식의 사전 검색을 처리합니다. |
| [src/commands/tools/music.js](../src/commands/tools/music.js) | 멜론 차트와 음악 검색을 처리합니다. |
| [src/commands/tools/weather.js](../src/commands/tools/weather.js) | 지역 날씨 검색을 처리합니다. |

## 설정과 핵심 흐름 — 13개

| 파일 | 역할 |
|---|---|
| [src/config/Config.js](../src/config/Config.js) | 환경 변수와 기본 설정을 합칩니다. |
| [src/config/defaults.js](../src/config/defaults.js) | 호출어, 주소, 운영 채널, 감시 주기 기본값을 정의합니다. |
| [src/config/env.js](../src/config/env.js) | 환경 변수를 검사하고 알맞은 형식으로 변환합니다. |
| [src/config/featureCatalog.js](../src/config/featureCatalog.js) | 기능 키, 한글 별칭과 기본 상태를 정의합니다. |
| [src/config/paths.js](../src/config/paths.js) | 레거시 호환 데이터 파일 경로를 정의합니다. |
| [src/config/privateKeyLoader.js](../src/config/privateKeyLoader.js) | 외부 API 키 파일을 안전하게 읽습니다. |
| [src/core/Bot.js](../src/core/Bot.js) | 서버와 감시 작업의 시작·종료 수명주기를 관리합니다. |
| [src/core/CommandParser.js](../src/core/CommandParser.js) | 호출어 제거와 원문·정규화 명령을 함께 만듭니다. |
| [src/core/ContextFactory.js](../src/core/ContextFactory.js) | 명령 실행에 필요한 사용자·채널·도구 서비스를 연결합니다. |
| [src/core/EventDetector.js](../src/core/EventDetector.js) | Iris type과 feedType을 이벤트 이름으로 변환합니다. |
| [src/core/EventManager.js](../src/core/EventManager.js) | 이벤트 실행과 오류 전달을 관리합니다. |
| [src/Main.js](../src/Main.js) | 프로그램 종료 시 서버와 데이터베이스를 순서대로 정리합니다. |

## 데이터베이스 — 19개

| 파일 | 역할 |
|---|---|
| [src/database/AtomicFileWriter.js](../src/database/AtomicFileWriter.js) | 임시 파일을 사용해 DB 파일을 교체합니다. |
| [src/database/DBControl.js](../src/database/DBControl.js) | sql.js 테이블 생성·조회·저장을 처리합니다. |
| [src/database/DatabaseRegistry.js](../src/database/DatabaseRegistry.js) | 같은 파일의 테이블들이 하나의 메모리 DB를 공유하게 합니다. |
| [src/database/FileWriteQueue.js](../src/database/FileWriteQueue.js) | 동일 파일 쓰기를 순서대로 실행합니다. |
| [src/database/repositories/AttendanceRepository.js](../src/database/repositories/AttendanceRepository.js) | 출석 일일 목록과 개인 통계를 저장합니다. |
| [src/database/repositories/BeraRepository.js](../src/database/repositories/BeraRepository.js) | 베라31 승패 기록을 저장합니다. |
| [src/database/repositories/ChannelRepository.js](../src/database/repositories/ChannelRepository.js) | 채널 조회·저장·삭제를 담당합니다. |
| [src/database/repositories/MagicAnswerRepository.js](../src/database/repositories/MagicAnswerRepository.js) | MagicAnswer.json 답변 목록을 읽습니다. |
| [src/database/repositories/MessageRepository.js](../src/database/repositories/MessageRepository.js) | Message.db의 대화 테이블을 조회합니다. |
| [src/database/repositories/StockRepository.js](../src/database/repositories/StockRepository.js) | 가상 주식 가격과 변동을 저장합니다. |
| [src/database/repositories/UserLogRepository.js](../src/database/repositories/UserLogRepository.js) | 채널별 사용자 활동 로그를 저장합니다. |
| [src/database/repositories/UserRepository.js](../src/database/repositories/UserRepository.js) | 채널별 사용자 계정과 스타를 저장합니다. |
| [src/database/schemas/attendanceSchema.js](../src/database/schemas/attendanceSchema.js) | 출석 테이블 열을 정의합니다. |
| [src/database/schemas/beraSchema.js](../src/database/schemas/beraSchema.js) | 베라31 승패 테이블 열을 정의합니다. |
| [src/database/schemas/channelSchema.js](../src/database/schemas/channelSchema.js) | 채널·대여·역할·기능 열을 정의합니다. |
| [src/database/schemas/messageSchema.js](../src/database/schemas/messageSchema.js) | 대화 문장과 조건 열을 정의합니다. |
| [src/database/schemas/stockSchema.js](../src/database/schemas/stockSchema.js) | 주식 가격 테이블 열을 정의합니다. |
| [src/database/schemas/userLogSchema.js](../src/database/schemas/userLogSchema.js) | 활동·명령·닉네임·메모 열을 정의합니다. |
| [src/database/schemas/userSchema.js](../src/database/schemas/userSchema.js) | 계정·권한·스타·인벤토리 열을 정의합니다. |

## 이벤트 — 10개

| 파일 | 역할 |
|---|---|
| [src/events/changeProfile.js](../src/events/changeProfile.js) | 닉네임 변경을 사용자와 로그에 반영합니다. |
| [src/events/deleteMessage.js](../src/events/deleteMessage.js) | 삭제 감지 공통 처리기를 연결합니다. |
| [src/events/error.js](../src/events/error.js) | 이벤트 오류를 기록합니다. |
| [src/events/hideMessage.js](../src/events/hideMessage.js) | 가리기 감지 공통 처리기를 연결합니다. |
| [src/events/join.js](../src/events/join.js) | 입장 이벤트 처리기를 연결합니다. |
| [src/events/kick.js](../src/events/kick.js) | 강퇴 이벤트 처리기를 연결합니다. |
| [src/events/leave.js](../src/events/leave.js) | 퇴장 이벤트 처리기를 연결합니다. |
| [src/events/memberEvent.js](../src/events/memberEvent.js) | 입장·퇴장·강퇴 기록과 안내를 공통 처리합니다. |
| [src/events/message.js](../src/events/message.js) | 밴 검사, 명령 실행, 채팅·명령 기록을 처리합니다. |
| [src/events/messageModerationEvent.js](../src/events/messageModerationEvent.js) | 삭제·가리기 안내를 공통 처리합니다. |

## 외부 연동과 출력 — 9개

| 파일 | 역할 |
|---|---|
| [src/integrations/dictionary/KoreanDictionaryClient.js](../src/integrations/dictionary/KoreanDictionaryClient.js) | 한국어기초사전 XML API를 호출하고 해석합니다. |
| [src/integrations/gemma/GemmaClient.js](../src/integrations/gemma/GemmaClient.js) | Gemma 생성 API 호출을 제공합니다. |
| [src/integrations/iris/IrisDataMapper.js](../src/integrations/iris/IrisDataMapper.js) | Iris DB 행을 Next 객체로 변환합니다. |
| [src/integrations/iris/IrisEventParser.js](../src/integrations/iris/IrisEventParser.js) | 메시지·feed 이벤트와 큰 ID·멘션·답장을 해석합니다. |
| [src/integrations/iris/IrisGateway.js](../src/integrations/iris/IrisGateway.js) | 메시지·역할·프로필을 Iris DB에서 조회합니다. |
| [src/integrations/music/MelonClient.js](../src/integrations/music/MelonClient.js) | 멜론 차트와 검색 API를 호출합니다. |
| [src/integrations/weather/NaverWeatherClient.js](../src/integrations/weather/NaverWeatherClient.js) | 네이버 검색 결과에서 날씨를 읽습니다. |
| [src/presenters/chat/channelInfoPresenter.js](../src/presenters/chat/channelInfoPresenter.js) | 채널 상태를 채팅 문장으로 만듭니다. |
| [src/presenters/chat/userInfoPresenter.js](../src/presenters/chat/userInfoPresenter.js) | 사용자 상태를 채팅 문장으로 만듭니다. |

## 서비스 — 32개

| 파일 | 역할 |
|---|---|
| [src/services/account/TransferService.js](../src/services/account/TransferService.js) | 송금 시간·잔액·대상 검사와 스타 이동을 처리합니다. |
| [src/services/account/UserLookupService.js](../src/services/account/UserLookupService.js) | private ID·공개 ID·이름 검색 결과를 합칩니다. |
| [src/services/account/UserSelectionService.js](../src/services/account/UserSelectionService.js) | 동명이인 선택 상태를 60초 동안 보관합니다. |
| [src/services/account/UserService.js](../src/services/account/UserService.js) | 사용자 생성·수정·밴·관리자·스타를 처리합니다. |
| [src/services/admin/BroadcastService.js](../src/services/admin/BroadcastService.js) | 유효한 대여 채널에 공지를 순차 전송합니다. |
| [src/services/admin/ChannelAdminService.js](../src/services/admin/ChannelAdminService.js) | 관리자용 채널 대여와 목록을 처리합니다. |
| [src/services/admin/UserAdminService.js](../src/services/admin/UserAdminService.js) | 관리자용 사용자 권한·경고·밴·스타 변경을 처리합니다. |
| [src/services/channel/ChannelExecutionPolicy.js](../src/services/channel/ChannelExecutionPolicy.js) | 대여 상태와 기능 활성화를 함께 검사합니다. |
| [src/services/channel/ChannelFeatureService.js](../src/services/channel/ChannelFeatureService.js) | 채널 기능 목록과 켜기·끄기를 처리합니다. |
| [src/services/channel/ChannelRegistrationService.js](../src/services/channel/ChannelRegistrationService.js) | 방장 등록 신청을 운영 채널로 전달합니다. |
| [src/services/channel/ChannelRoleService.js](../src/services/channel/ChannelRoleService.js) | 방장·부방장 판정과 Iris 역할 동기화를 처리합니다. |
| [src/services/channel/ChannelService.js](../src/services/channel/ChannelService.js) | 채널 생성·조회·수정과 기능 기본값을 관리합니다. |
| [src/services/channel/MemberMemoService.js](../src/services/channel/MemberMemoService.js) | 사용자 운영 메모를 저장·삭제합니다. |
| [src/services/channel/RentalService.js](../src/services/channel/RentalService.js) | 대여 등록·해지·만료·알림을 처리합니다. |
| [src/services/conversation/ConversationService.js](../src/services/conversation/ConversationService.js) | 조건부 DB 대화, 템플릿, 호감도 변화를 처리합니다. |
| [src/services/conversation/MagicAnswerService.js](../src/services/conversation/MagicAnswerService.js) | 마법 답변을 무작위로 선택합니다. |
| [src/services/conversation/RankingService.js](../src/services/conversation/RankingService.js) | 스타 상위 사용자를 계산합니다. |
| [src/services/games/AttendanceService.js](../src/services/games/AttendanceService.js) | 출석 보상·목록·개인 통계를 처리합니다. |
| [src/services/games/Bera31Service.js](../src/services/games/Bera31Service.js) | 채널별 베라31 진행 상태와 승패를 관리합니다. |
| [src/services/games/GamblingService.js](../src/services/games/GamblingService.js) | 단순 도박과 레거시 배팅 규칙을 계산합니다. |
| [src/services/games/NumberBaseballService.js](../src/services/games/NumberBaseballService.js) | 사용자별 숫자야구 상태를 관리합니다. |
| [src/services/games/StockService.js](../src/services/games/StockService.js) | 주식 가격 변동과 구매·판매를 처리합니다. |
| [src/services/games/WordChainService.js](../src/services/games/WordChainService.js) | 채널별 끝말잇기 상태와 사전 검사를 관리합니다. |
| [src/services/logging/CommandLogService.js](../src/services/logging/CommandLogService.js) | 명령 기록 저장·표시를 위임합니다. |
| [src/services/logging/MemberHistoryService.js](../src/services/logging/MemberHistoryService.js) | 입장·퇴장·강퇴 기록을 위임합니다. |
| [src/services/logging/MessageLogService.js](../src/services/logging/MessageLogService.js) | 일반 메시지 기록을 위임합니다. |
| [src/services/logging/NicknameHistoryService.js](../src/services/logging/NicknameHistoryService.js) | 닉네임 변경 기록을 위임합니다. |
| [src/services/logging/UserLogService.js](../src/services/logging/UserLogService.js) | 활동·명령·닉네임·메모 기록을 실제로 저장합니다. |
| [src/services/tools/CommandAnalysisService.js](../src/services/tools/CommandAnalysisService.js) | 필요할 때 Gemma 명령 유사도 분석을 제공합니다. |
| [src/services/tools/DictionaryService.js](../src/services/tools/DictionaryService.js) | 사전 결과를 채팅 문장으로 만듭니다. |
| [src/services/tools/MusicService.js](../src/services/tools/MusicService.js) | 차트·검색 결과를 채팅 문장으로 만듭니다. |
| [src/services/tools/WeatherService.js](../src/services/tools/WeatherService.js) | 날씨 결과를 채팅 문장으로 만듭니다. |

## 유틸리티·감시·테스트 — 9개

| 파일 | 역할 |
|---|---|
| [src/utils/CommandUtils.js](../src/utils/CommandUtils.js) | 명령 정규화·별칭 비교·정수 변환을 제공합니다. |
| [src/utils/dateTime.js](../src/utils/dateTime.js) | 한국 시간 날짜와 대여 남은 날을 계산합니다. |
| [src/utils/koreanJosa.js](../src/utils/koreanJosa.js) | 받침에 맞는 기본 조사를 붙입니다. |
| [src/utils/random.js](../src/utils/random.js) | 정수 난수와 배열 무작위 선택을 제공합니다. |
| [src/watchers/ChannelRoleWatcher.js](../src/watchers/ChannelRoleWatcher.js) | 여러 채널의 방장·부방장을 한 번에 동기화합니다. |
| [src/watchers/ProfileWatcher.js](../src/watchers/ProfileWatcher.js) | 프로필 스냅샷을 비교하고 오래된 항목을 제거합니다. |
| [src/watchers/RentNoticeWatcher.js](../src/watchers/RentNoticeWatcher.js) | 대여 종료 알림을 중복 없이 전송합니다. |
| [tests/integration/legacyFeatures.test.js](../tests/integration/legacyFeatures.test.js) | 대여·권한·선택·이벤트·다중 테이블 보존을 검증합니다. |
| [tests/integration/migrationCommands.test.js](../tests/integration/migrationCommands.test.js) | 계정·출석·송금의 레거시 호환 흐름을 검증합니다. |

## 범위와 주의 사항

- 레거시에서 라우팅이 비활성화되어 있던 주식·베라31·끝말잇기도 이관했지만 채널 기본값은 꺼짐입니다.
- 채팅 eval은 보안을 위해 임의 코드를 실행하지 않습니다.
- 외부 날씨·음악·사전은 실제 네트워크와 API 응답 형식을 배포 환경에서 추가 확인해야 합니다.
- 테스트는 19개가 통과했지만 실제 운영 Iris의 역할·프로필 DB 구조는 현장에서 확인해야 합니다.
