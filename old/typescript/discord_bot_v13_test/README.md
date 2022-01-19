# Discord bot

## [[ 서버에 봇 추가하기 ]](https://discord.com/)
    ↑ 현재 등록되어있지 않음

</br>

## 목차
  1. [설정](#Setup)
  2. [추가정보](#Extra_Information)

</br>

## 설정 <a name="Setup"></a>

  ### `.env.example` 파일을 `.env` 로 변경한 뒤 아래 내용을 참고해 수정해주세요.

  </br>

  | Environment variable | Value                        |
  | -------------------- | ---------------------------- |
  | `BOT_TOKEN`          | Discord bot token            |
  | `MONGOOSE_URL`       | Mongodb connection uri       |
  | `TEST_SERVER_ID`     | Server id of the test server |

  </br>

  ### node 와 npm 이 설치되어있는지 확인하고 아래 내용을 실행하세요.

  #### 설치

  * cmd 명령어
  ```bash
  npm install -g ts-node && npm i --save-dev --force typescript ts-node ts-node-dev && npm i --save-dev --force ts-cleaner nodemon @types/node @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-standard eslint-plugin-import eslint-plugin-node eslint-plugin-promise && npm i sodium --ignore-scripts --save --force && npm install --force && npm i @discordjs/voice --save --force && npm i prism-media --save --force && npm i @discordjs/opus --save --force && npm i opusscript --save --force && npm i libsodium-wrappers --save --force && npm i tweetnacl --save --force
  ```
  
  * PowerShell 명령어
  ```bash
  npm install -g ts-node; npm i --save-dev --force typescript ts-node ts-node-dev; npm i --save-dev --force ts-cleaner nodemon @types/node @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-standard eslint-plugin-import eslint-plugin-node eslint-plugin-promise; npm i sodium --ignore-scripts --save --force; npm install --force; npm i @discordjs/voice --save --force; npm i prism-media --save --force; npm i @discordjs/opus --save --force; npm i opusscript --save --force; npm i libsodium-wrappers --save --force; npm i tweetnacl --save --force
  ```
  * 봇 실행
  ```bash
  npm run dev
  ```
</br>

## 추가정보 <a name="Extra_Information"></a>

  ### 언어
  
  ```
  TypeScript is used for the bot for better code checking, and documentation. You can find the classes in the `src/types` folder, and interfaces for things such as the database, or OpenDota API in the `src/types/interfaces` folder.

  TypeScript는 더 나은 코드 검사 및 문서화를 위해 봇에 사용됩니다. `src/types` 폴더 에서 클래스를 찾을 수 있고 `src/types/interfaces` 폴더에서 데이터베이스등을 찾을 수 있습니다.
  ```

  ### Npm scripts

  | Script    | Purpose                                                         |
  | --------- | --------------------------------------------------------------- |
  | `start`   | Compiles the code and starts the bot                            |
  | `build`   | Compiles the code into `dist` folder                            |
  | `dev`     | Runs the TypeScript code using `ts-node`                        |

  ### 제작자

  * [tkrmagid](https://github.com/asd10384) - 제작
