# Project-Rumi-Next 전체 구조


```text
/Project-Rumi-Next
│
├── src/                                      # 챗봇·대시보드 API 코드
│   ├── Main.js                               # 프로그램 시작점
│   │
│   ├── bootstrap/                            # 구성요소 생성·등록·시작
│   │   ├── createApplication.js              # 전체 애플리케이션 구성
│   │   ├── createContainer.js                # Service·Repository 의존성 생성
│   │   ├── registerCommands.js               # 명령어 자동 등록
│   │   ├── registerEvents.js                 # 이벤트 핸들러 등록
│   │   ├── registerRoutes.js                 # 웹훅·관리 API 등록
│   │   ├── runMigrations.js                  # Dashboard DB 마이그레이션
│   │   └── startWatchers.js                  # 주기적 감시 작업 시작
│   │
│   ├── core/                                 # 챗봇 프레임워크 핵심
│   │   ├── Bot.js                            # 서버와 봇 시작·종료
│   │   ├── EventManager.js                   # on/emit 이벤트 관리
│   │   ├── EventDetector.js                  # type/feedType 이벤트 판별
│   │   ├── CommandManager.js                 # 명령어 등록·실행
│   │   ├── CommandParser.js                  # 호출어 제거·입력 정규화
│   │   ├── ContextFactory.js                 # ctx 객체 생성
│   │   ├── ResponseCollector.js              # 봇 응답과 명령 기록 수집
│   │   └── errors/
│   │       ├── AppError.js                   # 애플리케이션 공통 오류
│   │       ├── ErrorCodes.js                 # 오류 코드 목록
│   │       └── ErrorFormatter.js             # 사용자용 오류 메시지 변환
│   │
│   ├── commands/                             # 사용자 명령어
│   │   ├── system/
│   │   │   └── ping.js                       # ping
│   │   │
│   │   ├── dashboard/
│   │   │   └── verifyAccount.js              # 루미야 인증하기 {코드}
│   │   │
│   │   ├── account/
│   │   │   ├── userInfo.js                   # 내 정보
│   │   │   ├── userLookup.js                 # 사용자 검색·정보 조회
│   │   │   ├── userSelection.js              # 동명이인 번호 선택
│   │   │   └── transfer.js                   # 스타 송금
│   │   │
│   │   ├── channel/
│   │   │   ├── requestRegistration.js        # 채널 등록 신청
│   │   │   ├── channelInfo.js                # 방 정보
│   │   │   ├── featureToggle.js              # 기능 켜기·끄기
│   │   │   ├── previousMessage.js            # 이전 메시지
│   │   │   ├── memberInfo.js                 # 멤버 정보
│   │   │   ├── nicknameHistory.js            # 닉네임 변경 기록
│   │   │   ├── setMemberMemo.js              # 사용자 운영 메모 작성
│   │   │   └── deleteMemberMemo.js           # 사용자 운영 메모 삭제
│   │   │
│   │   ├── admin/
│   │   │   ├── broadcast.js                  # 전체 공지·방송
│   │   │   ├── commandHistory.js             # 명령어 사용 기록 조회
│   │   │   ├── channelId.js                  # 현재 채널 ID
│   │   │   ├── starRanking.js                # 채널별 스타 랭킹
│   │   │   ├── setAdmin.js                   # 관리자 권한 설정
│   │   │   ├── setBan.js                     # 밴 설정·해제
│   │   │   ├── setWarning.js                 # 경고 횟수 설정
│   │   │   ├── registerRental.js             # 채널 대여 등록
│   │   │   ├── adjustStar.js                 # 스타 증감
│   │   │   ├── userInfo.js                   # 관리자용 사용자 정보
│   │   │   ├── channelList.js                # 등록 채널 목록
│   │   │   ├── userList.js                   # 사용자 목록
│   │   │   └── eval.js                       # 개발용 평가, 운영 기본 비활성
│   │   │
│   │   ├── games/
│   │   │   ├── attendance.js                 # 출석·목록·내 출석
│   │   │   ├── gambling.js                   # 스타 도박
│   │   │   ├── numberBaseball.js             # 숫자야구
│   │   │   └── experimental/
│   │   │       ├── stock.js                  # 주식
│   │   │       ├── bera31.js                 # 베라 31
│   │   │       └── wordChain.js              # 끝말잇기
│   │   │
│   │   ├── tools/
│   │   │   ├── weather.js                    # 날씨 조회
│   │   │   ├── music.js                      # 음악 검색, 차트 조회
│   │   │   └── dictionary.js                 # 한국어 사전
│   │   │
│   │   └── conversation/
│   │       ├── help.js                       # 도움말·명령어 목록
│   │       ├── magicAnswer.js                # 접두사 없는 마법의 루미
│   │       ├── ranking.js                    # 전체 랭킹
│   │       └── heyRumi.js                    # 등록 명령이 없을 때 대화
│   │
│   ├── events/                               # 카카오톡 이벤트 핸들러
│   │   ├── message.js                        # 일반 메시지·명령 처리
│   │   ├── join.js                           # 입장
│   │   ├── leave.js                          # 퇴장
│   │   ├── kick.js                           # 강퇴
│   │   ├── deleteMessage.js                  # 메시지 삭제
│   │   ├── hideMessage.js                    # 메시지 가리기
│   │   ├── changeProfile.js                  # 닉네임·프로필 변경
│   │   └── error.js                          # 이벤트 처리 오류
│   │
│   ├── services/                             # 실제 기능 처리
│   │   ├── account/
│   │   │   ├── UserService.js                # 사용자 정보 조회·갱신
│   │   │   ├── UserLookupService.js          # ID·이름 사용자 검색
│   │   │   ├── UserSelectionService.js       # 동명이인 선택 상태·TTL
│   │   │   └── TransferService.js            # 잔액 확인·스타 송금
│   │   │
│   │   ├── channel/
│   │   │   ├── ChannelService.js             # 채널 정보 조회·갱신
│   │   │   ├── ChannelRegistrationService.js # 로그 데이터 생성·채널 등록
│   │   │   ├── ChannelFeatureService.js      # 채팅·API 공통 기능 상태
│   │   │   ├── ChannelExecutionPolicy.js     # 대여·정지·기능 실행 판단
│   │   │   ├── ChannelRoleService.js         # 방장·부방장 판별
│   │   │   ├── RentalService.js              # 대여 등록·해지·만료
│   │   │   └── MemberMemoService.js          # 사용자 운영 메모
│   │   │
│   │   ├── admin/
│   │   │   ├── BroadcastService.js           # 등록 채널 전체 전송
│   │   │   ├── UserAdminService.js           # 관리자·밴·경고·스타
│   │   │   └── ChannelAdminService.js        # 채널 대여·목록 관리
│   │   │
│   │   ├── logging/
│   │   │   ├── UserLogService.js             # 사용자 기본 로그
│   │   │   ├── MemberHistoryService.js       # 입장·퇴장·강퇴 기록
│   │   │   ├── NicknameHistoryService.js     # 닉네임 변경 기록
│   │   │   ├── MessageLogService.js          # 일반 메시지 기록
│   │   │   └── CommandLogService.js          # 명령과 봇 응답 기록
│   │   │
│   │   ├── games/
│   │   │   ├── AttendanceService.js          # 출석·목록·내 출석
│   │   │   ├── GamblingService.js            # 스타 도박
│   │   │   ├── NumberBaseballService.js      # 숫자야구
│   │   │   ├── StockService.js               # 주식 게임
│   │   │   ├── Bera31Service.js              # 베라 31
│   │   │   └── WordChainService.js           # 끝말잇기
│   │   │
│   │   ├── tools/
│   │   │   ├── WeatherService.js             # 날씨 결과 정리
│   │   │   ├── MusicService.js               # 음악 검색·차트 결과 정리
│   │   │   ├── DictionaryService.js          # 사전 검색
│   │   │   └── CommandAnalysisService.js     # Gemma 명령 유사도 분석
│   │   │
│   │   ├── conversation/
│   │   │   ├── ConversationService.js        # Hey Rumi 대화
│   │   │   ├── MagicAnswerService.js         # 마법의 루미님
│   │   │   └── RankingService.js             # 전체 랭킹
│   │   │
│   │   └── dashboard/
│   │       ├── DashboardAuthService.js        # 채팅 인증·계정 연결
│   │       ├── WebAccountService.js           # 가입·로그인·비밀번호
│   │       ├── SessionService.js              # 세션·CSRF
│   │       ├── PermissionService.js           # siteRole·channelRole
│   │       ├── DashboardQueryService.js       # HOME·MY 화면 데이터
│   │       ├── ChannelTemplateService.js      # 답변 템플릿 저장·렌더링
│   │       ├── BotStatusService.js            # online·degraded 상태
│   │       ├── MemberQueryService.js          # 멤버 목록·상세
│   │       └── AuditService.js                # 관리자 변경 감사 기록
│   │
│   ├── presenters/                            # 출력 형식 변환
│   │   ├── chat/
│   │   │   ├── attendancePresenter.js         # 출석 객체 → 채팅 문장
│   │   │   ├── userInfoPresenter.js           # 사용자 객체 → 채팅 문장
│   │   │   ├── channelInfoPresenter.js        # 채널 객체 → 채팅 문장
│   │   │   └── errorPresenter.js              # 오류 → 채팅 문장
│   │   └── api/
│   │       ├── responsePresenter.js           # {data, meta}
│   │       ├── errorPresenter.js              # {error, meta}
│   │       ├── homePresenter.js               # HOME 응답
│   │       ├── memberPresenter.js             # 멤버 응답
│   │       └── featurePresenter.js            # 기능 응답
│   │
│   │
│   ├── integrations/                         # 외부 서버 및 API
│   │   ├── iris/
│   │   │   ├── IrisClient.js                 # Iris HTTP 공통 요청
│   │   │   ├── IrisQueryClient.js            # POST /query
│   │   │   ├── IrisReplyClient.js            # POST /reply
│   │   │   ├── IrisGateway.js                # 유저·채널·메시지·역할 조회
│   │   │   ├── IrisEventParser.js            # type/feedType 해석
│   │   │   └── IrisDataMapper.js             # Iris 원본 → ctx 변환
│   │   ├── gemma/
│   │   │   └── GemmaClient.js                # Gemma API 요청
│   │   ├── weather/
│   │   │   └── NaverWeatherClient.js         # 네이버 날씨 조회
│   │   ├── music/
│   │   │   └── MelonClient.js                # 멜론 검색·차트 조회
│   │   └── dictionary/
│   │       └── KoreanDictionaryClient.js     # 한국어 사전 조회
│   │
│   ├── http/                                 # 챗봇 웹훅·대시보드 API 서버
│   │   ├── createServer.js                   # Express 서버 생성
│   │   ├── routes/
│   │   │   └── irisWebhookRoute.js           # POST /message
│   │   │   └── api/
│   │   │       └── v1/
│   │   │           ├── index.js                  # /api/v1 Router 조립
│   │   │           ├── authRoutes.js             # 세션·인증·가입·로그인
│   │   │           ├── channelRoutes.js          # HOME·MY·RENT·상태
│   │   │           ├── featureRoutes.js          # 기능·전체 정지
│   │   │           ├── templateRoutes.js         # 답변 템플릿
│   │   │           ├── memberRoutes.js           # 멤버·운영 메모
│   │   │           └── adminRoutes.js            # 사이트 관리자
│   │   │
│   │   ├── controllers/
│   │   │   └── api/
│   │   │       └── v1/
│   │   │           ├── AuthController.js         # 세션·인증·가입·로그인
│   │   │           ├── ChannelController.js      # HOME·MY·RENT·상태
│   │   │           ├── FeatureController.js      # 기능·전체 정지
│   │   │           ├── TemplateController.js     # 답변 템플릿
│   │   │           ├── MemberController.js       # 멤버·운영 메모
│   │   │           └── AdminController.js        # 사이트 관리자
│   │   │
│   │   └── middleware/
│   │       ├── irisBigIntJsonParser.js       # /message의 큰 ID를 문자열로 보존
│   │       ├── apiJsonParser.js              # /api/v1 JSON 파싱
│   │       ├── corsPolicy.js                 # 별도 배포 화면 Origin 허용
│   │       ├── requestId.js                  # 요청 ID 생성
│   │       ├── requestLogger.js              # HTTP 요청 기록
│   │       ├── loadSession.js                # 익명·로그인 세션 불러오기
│   │       ├── requireLogin.js               # 로그인 필수 API 보호
│   │       ├── csrfProtection.js             # CSRF·Origin 확인
│   │       ├── requireChannelAccess.js       # 채널 연결 권한
│   │       ├── requireChannelManager.js      # 방장·부방장 재검증
│   │       ├── requireSiteAdmin.js           # 사이트 관리자
│   │       ├── validateRequest.js            # 입력값·허용 필드
│   │       ├── requireVersion.js             # If-Match·ETag
│   │       ├── rateLimiter.js                # 로그인·인증 요청 제한
│   │       ├── notFoundHandler.js            # 404 처리
│   │       └── errorHandler.js               # HTTP 오류 처리
│   │
│   ├── watchers/                             # 일정 간격으로 실행
│   │   ├── ProfileWatcher.js                 # 프로필 변경 감시
│   │   ├── ChannelRoleWatcher.js             # 방장·부방장 동기화
│   │   ├── RentNoticeWatcher.js              # 대여 종료 알림
│   │   └── IrisHealthWatcher.js              # 대시보드 봇 상태
│   │
│   ├── database/                             # 현재 다중 SQLite 구조 유지
│   │   ├── DBControl.js                      # sql.js 기반 공통 DB 제어
│   │   ├── DatabaseRegistry.js               # DB 인스턴스 생성·캐시
│   │   ├── FileWriteQueue.js                 # 파일 단위 쓰기 직렬화
│   │   ├── AtomicFileWriter.js               # 임시 파일 후 원자적 교체
│   │   ├── schemas/                          # autoCreate 스키마 정의
│   │   │   ├── userSchema.js                 # UserData.db
│   │   │   ├── userLogSchema.js              # UserJLLog.db
│   │   │   ├── channelSchema.js              # ChannelJLLog.db
│   │   │   ├── attendanceSchema.js           # AttendanceData.db
│   │   │   ├── beraSchema.js                 # BeraData.db
│   │   │   ├── stockSchema.js                # StockData.db
│   │   │   ├── messageSchema.js              # Message.db
│   │   │   └── itemSchemas.js                # 아이템 DB 공통 스키마
│   │   ├── repositories/                     # 저장 형식별 데이터 접근
│   │   │   ├── UserRepository.js             # UserData.db
│   │   │   ├── UserLogRepository.js          # UserJLLog.db
│   │   │   ├── ChannelRepository.js          # ChannelJLLog.db
│   │   │   ├── AttendanceRepository.js       # AttendanceData.db
│   │   │   ├── BeraRepository.js             # BeraData.db
│   │   │   ├── StockRepository.js            # StockData.db
│   │   │   ├── MessageRepository.js          # Message.db
│   │   │   ├── MagicAnswerRepository.js      # MagicAnswer.json
│   │   │   ├── RecordRepository.js           # RecordList.json
│   │   │   ├── SettingRepository.js          # SetList.json
│   │   │   └── items/
│   │   │       ├── BadgeRepository.js        # BadgeItem.db
│   │   │       ├── MembershipRepository.js   # Membership.db
│   │   │       ├── FoodRepository.js         # FoodItem.db
│   │   │       ├── TicketRepository.js       # TicketItem.db
│   │   │       └── LoanRepository.js         # LoanItem.db

│   │   └── dashboard/                        # 신규 Dashboard.db
│   │       ├── DashboardDatabase.js          # 트랜잭션 지원 연결
│   │       ├── MigrationRunner.js            # 버전별 스키마 적용
│   │       ├── migrations/                   # 버전별 SQL 마이그레이션
│   │       │   ├── 001_web_accounts.sql          # 웹 계정·사이트 권한
│   │       │   ├── 002_account_channel_links.sql # 계정·카카오 채널 연결
│   │       │   ├── 003_member_refs.sql           # 대시보드용 memberId 연결
│   │       │   ├── 004_web_sessions.sql          # 세션·CSRF
│   │       │   ├── 005_auth_challenges.sql       # 채팅 인증 코드
│   │       │   ├── 006_channel_settings.sql      # 일시정지·리소스 버전
│   │       │   ├── 007_channel_templates.sql     # 답변 템플릿
│   │       │   ├── 008_resource_versions.sql     # 기존 Bot DB 자원 버전
│   │       │   ├── 009_admin_member_memos.sql    # 관리자용 멤버 메모
│   │       │   ├── 010_audit_logs.sql            # 감사 로그
│   │       │   └── 011_idempotency_records.sql   # 멱등성 기록
│   │       └── repositories/                     # Dashboard DB 접근
│   │           ├── AccountRepository.js          # web_accounts
│   │           ├── ChannelLinkRepository.js      # account_channel_links
│   │           ├── MemberRefRepository.js        # member_refs
│   │           ├── SessionRepository.js          # web_sessions
│   │           ├── AuthChallengeRepository.js    # auth_challenges
│   │           ├── ChannelSettingRepository.js   # channel_settings
│   │           ├── TemplateRepository.js         # channel_templates
│   │           ├── ResourceVersionRepository.js  # resource_versions
│   │           ├── AdminMemoRepository.js        # admin_member_memos
│   │           ├── AuditLogRepository.js         # audit_logs
│   │           └── IdempotencyRepository.js      # idempotency_records
│   │
│   ├── config/
│   │   ├── Config.js                         # 기존 Config 호환 진입점
│   │   ├── env.js                            # Iris 주소·포트·개발 모드
│   │   ├── defaults.js                       # 호출어·은행 시간·기본값
│   │   ├── paths.js                          # 프로젝트·data·config 경로
│   │   ├── featureCatalog.js                 # 기능 키와 한글 별칭
│   │   ├── templateCatalog.js                # 템플릿·허용 변수
│   │   ├── permissionPolicy.js               # 권한 정책
│   │   ├── cors.js                           # 대시보드 허용 Origin
│   │   └── privateKeyLoader.js               # private.json 읽기
│   │
│   └── utils/
│       ├── CommandUtils.js                   # normalize·isCommand
│       ├── mention.js                        # 멘션 파싱
│       ├── koreanJosa.js                     # 기존 fixJosa
│       ├── dateTime.js                       # 날짜 형식·시간 계산
│       ├── number.js                         # 정수·금액 파싱
│       ├── random.js                         # 랜덤 값 생성
│       ├── passwordHasher.js                 # 비밀번호 해시·검증
│       ├── tokenHasher.js                    # 세션·인증 코드 해시
│       ├── cursor.js                         # 목록 커서 생성·검증
│       ├── etag.js                           # 리소스 버전·ETag
│       ├── logger.js                         # 애플리케이션 로그
│       └── validator.js                      # 입력값 검증
│
├── data/
│   ├── users/
│   │   ├── UserData.db
│   │   ├── UserJLLog.db
│   │   └── games/
│   │       ├── AttendanceData.db
│   │       └── BeraData.db
│   ├── channels/
│   │   └── ChannelJLLog.db
│   ├── games/
│   │   └── StockData.db
│   ├── db/
│   │   ├── Message.db
│   │   ├── MagicAnswer.json
│   │   ├── BadgeItem.db
│   │   ├── Membership.db
│   │   ├── FoodItem.db
│   │   ├── TicketItem.db
│   │   ├── LoanItem.db
│   │   └── xlsx/
│   │       ├── Message.csv
│   │       ├── BadgeItem.csv
│   │       ├── MembershipItem.csv
│   │       ├── FoodItem.csv
│   │       ├── TicketItem.csv
│   │       └── LoanItem.csv
│   ├── etc/
│   │   ├── RecordList.json
│   │   └── SetList.json
│   ├── dashboard/
│   │   └── Dashboard.db
│   ├── cache/
│   └── backups/
│
├── config/
│   ├── private.example.json                      # 비밀 설정 형식 예시
│   └── private.json                              # Git 제외
│
├── scripts/
│   ├── backupDatabases.js                        # 전체 DB 백업
│   ├── migrateDashboard.js                       # Dashboard DB 마이그레이션
│   ├── checkLegacyData.js                        # 중복·경로 점검
│   └── createSiteAdmin.js                        # 최초 사이트 관리자 생성
│
├── tests/
│   ├── unit/
│   │   ├── core/                       # Bot·Event·Command 단위 테스트
│   │   ├── commands/                   # 명령어 단위 테스트
│   │   │   ├── system/                 # ping 단위 테스트
│   │   │   ├── dashboard/              # verifyAccount 단위 테스트 
│   │   │   ├── account/                # userInfo·userLookup 단위 테스트 
│   │   │   ├── channel/                # requestRegistration·channelInfo 단위 테스트
│   │   │   ├── admin/                  # broadcast·commandHistory 단위 테스트
│   │   │   ├── games/                  # attendance·gambling 단위 테스트
│   │   │   ├── tools/                  # weather·music 단위 테스트
│   │   │   └── conversation/           # help·magicAnswer 단위 테스트
│   │   ├── services/                   # Service 단위 테스트
│   │   ├── presenters/                 # Presenter 단위 테스트
│   │   ├── repositories/               # Repository 단위 테스트
│   │   └── middleware/                 # Middleware 단위 테스트
│   ├── integration/
│   │   ├── irisWebhook.test.js         # Iris Webhook 통합 테스트
│   │   ├── dashboardAuth.test.js       # 대시보드 인증 통합 테스트
│   │   ├── dashboardApi.test.js        # 대시보드 API 통합 테스트
│   │   ├── permission.test.js          # 권한 정책 통합 테스트
│   │   ├── databaseQueue.test.js       # DB 쓰기 직렬화 통합 테스트
│   │   └── templateEvent.test.js       # 답변 템플릿 이벤트 통합 테스트
│   ├── security/
│   │   ├── csrf.test.js                # CSRF·Origin 통합 테스트
│   │   ├── cors.test.js                # CORS 통합 테스트
│   │   ├── challengeReuse.test.js      # 인증 코드 재사용 방지 통합 테스트
│   │   └── idor.test.js                # IDOR 취약점 방지 통합 테스트
│   └── fixtures/
│
├── docs/
│   ├── Dashboard-API.md
│   ├── Dashboard-Deployment.md                # 별도 프런트엔드 연결·CORS
│   └── assets/                               # Rumi.png 등
├── examples/
│   └── basicBot.js
├── logs/
│   └── .gitkeep
├── .env
├── .env.example
├── .gitignore
├── ecosystem.config.cjs
├── package.json
├── package-lock.json
└── README.md
```

## env_example

```env
DASHBOARD_ORIGIN=https://bot.teamcloud.com
SESSION_COOKIE_SECURE=true
```
