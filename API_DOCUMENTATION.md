# AITale 백엔드 API 문서 (로그인/회원가입)

## 1. API 엔드포인트 정보

### 기본 설정
- **Base URL**: `http://localhost:8080`
- **API Prefix**: `/user-service/api/v1/users`
- **전체 경로**: `http://localhost:8080/user-service/api/v1/users`

---

## 2. 회원가입 API

### 엔드포인트
```
POST /user-service/api/v1/users/signup
```

### 요청 데이터 (Request Body)
```json
{
  "email": "user@example.com",
  "password": "password123",
  "age": 25
}
```

### 요청 필드
| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| `email` | String | O | 사용자 이메일 |
| `password` | String | O | 사용자 비밀번호 (평문으로 전송 후 서버에서 BCrypt 암호화) |
| `age` | Integer | O | 사용자 나이 |

### 응답 데이터 (Response)
```json
{
  "email": "user@example.com",
  "age": 25,
  "currentLevel": 1,
  "assignedDifficulty": null
}
```

### 응답 필드
| 필드명 | 타입 | 설명 |
|--------|------|------|
| `email` | String | 사용자 이메일 |
| `age` | Integer | 사용자 나이 |
| `currentLevel` | Integer | 현재 레벨 (기본값: 1) |
| `assignedDifficulty` | String | 할당된 학습 난이도 (기본값: null) |

### HTTP 상태 코드
- **200 OK**: 회원가입 성공
- **400 Bad Request**: 입력 데이터 오류
- **500 Internal Server Error**: 서버 오류

---

## 3. 로그인 API

### 엔드포인트
```
POST /user-service/api/v1/users/signin
```

### 요청 데이터 (Request Body)
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### 요청 필드
| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| `email` | String | O | 사용자 이메일 |
| `password` | String | O | 사용자 비밀번호 (평문) |

### 응답 데이터 (Response)
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9..."
}
```

### 응답 헤더
| 헤더명 | 값 |
|--------|-----|
| `Authorization` | `Bearer {accessToken}` |
| `Refresh-Token` | `{refreshToken}` |
| `Access-Control-Expose-Headers` | `Authorization, Refresh-Token` |

### 응답 필드
| 필드명 | 타입 | 설명 |
|--------|------|------|
| `accessToken` | String | JWT Access Token (30분 만료) |
| `refreshToken` | String | JWT Refresh Token (7일 만료) |

### HTTP 상태 코드
- **200 OK**: 로그인 성공
- **400/401 Unauthorized**: 이메일 또는 비밀번호 오류
- **500 Internal Server Error**: 서버 오류

---

## 4. JWT 토큰 처리

### 토큰 구조
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Secret Key**: `${jwt.secret}` (최소 32바이트)

### Access Token
- **만료 시간**: 30분 (1800초)
- **Subject**: `userSystemId` (Long 타입을 String으로 변환)
- **발급 시간**: 발급 당시 시간 (IssuedAt)
- **만료 시간**: 발급 시간 + 30분 (Expiration)

### Refresh Token
- **만료 시간**: 7일 (604800초)
- **Subject**: `userSystemId`
- **저장소**: Redis (TTL: 604800초)
- **저장 키**: `RT:{userSystemId}`

### 토큰 사용
```
Authorization 헤더에 포함:
Authorization: Bearer {accessToken}
```

### 토큰 파싱 (프론트엔드)
```javascript
// JWT에서 userId 추출
function decodeJwtPayload(token) {
  const payload = token.split(".")[1];
  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
  const decoded = decodeURIComponent(
    atob(normalized)
      .split("")
      .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
      .join("")
  );
  return JSON.parse(decoded);
}

// Subject에서 userSystemId 추출
const payload = decodeJwtPayload(token);
const userId = payload?.sub; // Subject는 "sub" 필드에 저장됨
```

---

## 5. 프로필 조회 API

### 엔드포인트
```
GET /user-service/api/v1/users/me/profile
```

### 요청 헤더
```
Authorization: Bearer {accessToken}
```

### 응답 데이터
```json
{
  "email": "user@example.com",
  "age": 25,
  "currentLevel": 1,
  "assignedDifficulty": null
}
```

---

## 6. 관심사 설정 API

### 엔드포인트
```
PUT /user-service/api/v1/users/me/interests
```

### 요청 헤더
```
Authorization: Bearer {accessToken}
```

### 요청 데이터
```json
{
  "interests": [1, 2, 3]
}
```

### 응답 데이터
```json
[1, 2, 3]
```

---

## 7. 보안 설정

### CORS 설정
- **허용 Origin**: `*` (모든 도메인)
- **허용 Methods**: GET, POST, PUT, DELETE, OPTIONS, PATCH
- **허용 Headers**: 모든 헤더
- **Max Age**: 3600초 (1시간)

### 비밀번호 암호화
- **Algorithm**: BCrypt
- **사용 위치**: UserService.signUp() 메서드에서 `passwordEncoder.encode()`로 암호화

### 로그인 검증 절차
1. 이메일로 사용자 조회
2. 입력된 평문 비밀번호와 저장된 암호화된 비밀번호를 `passwordEncoder.matches()`로 비교
3. 일치하면 Access Token & Refresh Token 생성
4. Refresh Token은 Redis에 저장

---

## 8. 프론트엔드 호출 예제

### 회원가입
```javascript
import { signUp } from "../../services/userService";

const result = await signUp({
  email: "user@example.com",
  password: "password123",
  age: 25
});
// result: { email, age, currentLevel, assignedDifficulty }
```

### 로그인
```javascript
import { signIn, persistAuth } from "../../services/userService";

const result = await signIn({
  email: "user@example.com",
  password: "password123"
});
// result: { accessToken, refreshToken }
// 자동으로 localStorage에 저장됨
```

### JWT 토큰 자동 처리
- **httpClient.js**에서 자동으로 `Authorization` 헤더 추가
- `localStorage.getItem("accessToken")`에서 토큰 읽음
- 모든 인증 필요 요청에 자동 포함
- `useAuth: false` 옵션으로 토큰 미포함 가능

---

## 9. 클라이언트 처리 흐름

### 회원가입 완료 후 처리
```javascript
1. signUp() 호출
2. signIn() 호출 (자동 로그인)
3. persistAuth() 실행
   - accessToken 저장 (localStorage.item: "accessToken")
   - refreshToken 저장 (localStorage.item: "refreshToken")
   - userId 저장 (JWT payload의 sub 필드에서 추출)
4. 관심사 3개 선택 후 updateInterests() 호출
5. /main 으로 페이지 이동
```

### 로그인 후 토큰 저장
```javascript
const result = await signIn(credentials);
// 응답 헤더에서 토큰 추출:
// - Authorization: "Bearer {accessToken}"
// - Refresh-Token: "{refreshToken}"
persistAuth(result.accessToken, result.refreshToken);
```

---

## 10. 에러 처리

### 일반적인 에러 시나리오
| 상황 | 예상 에러 | 대응방안 |
|------|---------|--------|
| 이메일 미입력 | 400 Bad Request | 필수 필드 입력 안내 |
| 잘못된 이메일 형식 | 400 Bad Request | 이메일 형식 검증 |
| 비밀번호 오류 | 401 Unauthorized | "비밀번호가 틀렸습니다" 안내 |
| 이메일 없음 | 404 Not Found (또는 500 Error) | "등록되지 않은 이메일입니다" 안내 |
| JWT 만료 | 401 Unauthorized | Refresh Token으로 재발급 |
| JWT 변조 | 401 Unauthorized | 로그인 페이지로 리다이렉트 |

---

## 11. 관련 백엔드 클래스

### Controller
- **클래스**: `UserController.java`
- **위치**: `com.aitale.user.ctrl`
- **역할**: HTTP 요청 처리 및 라우팅

### Service
- **클래스**: `UserService.java`
- **위치**: `com.aitale.user.service`
- **역할**: 비즈니스 로직 처리 (가입, 로그인, 토큰 생성)

### JWT 제공자
- **클래스**: `JwtProvider.java`
- **위치**: `com.aitale.user.provider`
- **역할**: JWT 토큰 생성 및 파싱

### 보안 설정
- **클래스**: `SecurityConfig.java`
- **위치**: `com.aitale.user.config`
- **역할**: Spring Security 및 CORS 설정

### Entity
- **클래스**: `UserEntity.java`
- **위치**: `com.aitale.user.domain.entity`
- **필드**: userSystemId, email, password, age, currentLevel, assignedDifficulty

---

## 12. 주요 구현 요점

✅ **완료된 사항**
- 회원가입/로그인 API 구현
- JWT 토큰 기반 인증
- Redis를 이용한 RefreshToken 저장
- BCrypt를 이용한 비밀번호 암호화
- CORS 설정
- 프론트엔드 userService 통합

⚠️ **주의사항**
- 클라이언트는 토큰을 localStorage에 저장 (HTTPS 환경 권장)
- Refresh Token 재발급 로직은 아직 구현되지 않음
- 토큰 만료 시 자동 재로그인 처리 필요

