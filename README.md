# weather-api

행정구역코드를 받아와 해당 구역의 단기 예보 정보를 출력해 주는 날씨 api 입니다.

## 기술

> - Nodejs / Express
> - Mysql

## 실행

```
1. git clone https://github.com/harin0224/weather-api.git
2. cd weather-api
3. npm install
4. node app.js
```

## API 명세서

- **URL** <br />
  `/short-weather`
  


- **Method** <br />
  `GET`
  


- **Data Params** <br />
  `code = [integer]`
  


- **Response**
  - **Code**: 200 <br />
    **Content**:
    ```
    [
        {
          "baseDate": "20230309",
          "baseTime": "0200",
          "category": "TMP",
          "fcstDate": "20230309",
          "fcstTime": "0300",
          "fcstValue": "12",
          "nx": 60,
          "ny": 127
        }
    ]
    ```
