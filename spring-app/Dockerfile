# --- Build Stage ---
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
# Fat JARを確実に生成する
RUN mvn package -DskipTests spring-boot:repackage

# --- Run Stage ---
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# ビルドステージから生成されたJARファイルだけをコピー
COPY --from=build /app/target/harvest-app-0.0.1-SNAPSHOT.jar .

# ★★★★★ 新しいアプローチ ★★★★★
# エントリーポイント・スクリプトをコピーし、実行権限を与える
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

# ポートを公開
EXPOSE 10000

# ★★★★★ コンテナ起動時に、このスクリプトを実行する ★★★★★
ENTRYPOINT ["./entrypoint.sh"]
