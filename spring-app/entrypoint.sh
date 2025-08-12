#!/bin/sh

# ---
# 確実なデバッグのために、変数が渡されているか再度確認する
# ---
echo "--- ENTRYPOINT SCRIPT: CHECKING ENVIRONMENT VARIABLES ---"
echo "PORT: ${PORT}"
echo "DATASOURCE URL: ${SPRING_DATASOURCE_URL}"
echo "DATASOURCE USERNAME: ${SPRING_DATASOURCE_USERNAME}"
# パスワードはログに出力しないのがベストプラクティス
if [ -n "$SPRING_DATASOURCE_PASSWORD" ]; then
    echo "DATASOURCE PASSWORD: [SET]"
else
    echo "DATASOURCE PASSWORD: [NOT SET]"
fi
echo "--- STARTING APPLICATION ---"

# ---
# アプリケーションを、システムプロパティとして変数を渡して実行する
# ---
exec java -Dserver.port=${PORT} \
          -Dspring.datasource.url=${SPRING_DATASOURCE_URL} \
          -Dspring.datasource.username=${SPRING_DATASOURCE_USERNAME} \
          -Dspring.datasource.password=${SPRING_DATASOURCE_PASSWORD} \
          -jar harvest-app-0.0.1-SNAPSHOT.jar
