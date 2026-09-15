# Iris 핑 응답 확인

현재 확인된 VPS 구성은 ReDroid 컨테이너 IP `172.17.0.2`, Docker 게이트웨이 `172.17.0.1`, Iris 포트 연결 `127.0.0.1:3000 -> 3000/tcp`입니다. VPS에서 실행하는 Next는 `IRIS_BASE_URL=http://127.0.0.1:3000`으로 Iris를 호출합니다. Iris에서 Next로 전달하는 웹훅 목적지는 `http://172.17.0.1:2907/message`입니다.

기존 `.env`는 기본값보다 우선하므로 주소를 확인하고 변경해야 합니다.

```env
IRIS_BASE_URL=http://127.0.0.1:3000
HOST=172.17.0.1
PORT=2907
```

VPS에서 `curl --max-time 5 http://127.0.0.1:3000/config`로 Iris 설정을 확인합니다. `web_server_endpoint`가 위 웹훅 목적지와 다르면 Iris 설정에서 목적지를 변경합니다.

수정한 코드를 VPS에 반영하고 프로세스를 재시작합니다. 직접 실행은 `npm start`, 기존 PM2 프로세스를 사용한다면 해당 프로세스를 재시작합니다.

채팅 본문과 정상 수신·명령 처리 과정은 콘솔에 출력하지 않습니다. HTTP 요청 처리 실패 시 출력되는 오류와 `IRIS_BASE_URL`을 확인합니다. 현재 핑은 `json.type=1` 또는 `type=1`을 처리합니다.

VPS에서 서버 바인딩을 확인합니다.

```sh
ss -ltnp | grep ':2907'
```

`HOST`는 Next가 웹훅을 받는 주소입니다. `0.0.0.0`은 모든 IPv4 인터페이스에서 수신합니다. `172.17.0.1`처럼 특정 주소로 바인딩했다면, 실제 웹훅이 그 주소에 도달하는 구성이 필요합니다. 기존 기본값은 유지했으며 `.env`의 `HOST`로 변경할 수 있습니다.

현재 기본 수신 주소를 사용하는 VPS에서는 아래 요청으로 수신만 확인할 수 있습니다. 실제 수신 주소가 다르면 시작 로그의 주소로 바꿉니다. type 0 이벤트이므로 채팅 응답은 보내지 않습니다.

```sh
curl --max-time 5 -H 'Content-Type: application/json' \
  -d '{"type":0}' http://172.17.0.1:2907/message
```

`{"ok":true}`가 반환되면 해당 주소의 HTTP 수신은 정상입니다.

실제 채팅에 응답이 없다면 Iris의 웹훅 목적지와 그 목적지까지의 네트워크 경로를 확인해야 합니다. `IRIS_BASE_URL`은 Next에서 Iris로 요청을 보내는 주소이며, 이 값을 설정해도 Iris의 웹훅 목적지가 자동 등록되지는 않습니다.

Iris의 웹훅 목적지는 `http://<Iris에서 접근 가능한 Next 주소>:2907/message`입니다. `IRIS_BASE_URL`은 반대로 VPS에서 Iris API로 접근하는 주소입니다. 두 주소는 각각 확인해야 합니다.

VPS에서 실제 Iris 주소로 아래 읽기 전용 쿼리를 보내면 API 연결을 확인할 수 있습니다. 응답 전송이나 실제 채팅 메시지는 발생하지 않습니다.

```sh
curl --max-time 10 -H 'Content-Type: application/json' \
  -d '{"query":"SELECT 1 AS ok","bind":[]}' \
  http://<Iris 주소>:3000/query
```

Next는 Iris의 최상위 `msg`를 우선 사용합니다. 이전 형식처럼 `msg` 없이 `json.id` 또는 `json._id`만 제공되는 경우 fork와 같이 `/query`에서 메시지 본문을 조회합니다. JSON을 보내는 요청은 Content-Type이 누락되거나 다르더라도 파싱합니다.

실제 VPS와 카카오톡 연결은 로컬 가짜 Iris 서버 테스트와 별도로 확인해야 합니다.

Iris API가 제한 시간 안에 응답하지 않으면 오류에 `/query` 또는 `/reply`, API 접속 주소, 제한 시간이 표시됩니다. `/query`는 메시지 조회 단계, `/reply`는 응답 전송 단계입니다. VPS에서 먼저 `curl --max-time 5 http://127.0.0.1:3000/config`의 응답 여부와 시작 로그의 실제 Iris API 주소를 확인합니다. `/config`는 응답해도 `/reply`만 지연된다면 Iris의 전송 처리 상태를 추가로 확인해야 합니다.
