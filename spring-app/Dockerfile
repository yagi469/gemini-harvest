# ベースイメージとしてMavenとJDKが含まれるものを選択
FROM maven:3.9.6-eclipse-temurin-17

# 作業ディレクトリを設定
WORKDIR /app

# ソースコード全体をコピー
COPY . .

# ポートを公開
EXPOSE 10000

# ★★★★★ これが最後の、そして真の解決策 ★★★★★
# jvmArgumentsをシングルクォートではなく、ダブルクォートで囲む
CMD ["sh", "-c", "mvn spring-boot:run -Dspring-boot.run.jvmArguments=\"-Dserver.port=${PORT} -Dspring.datasource.url=${SPRING_DATASOURCE_URL} -Dspring.datasource.username=${SPRING_DATASOURCE_USERNAME} -Dspring.datasource.password=${SPRING_DATASOURCE_PASSWORD}\""]
