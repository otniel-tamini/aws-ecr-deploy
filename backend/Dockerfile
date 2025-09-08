# ---- Build stage ----
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /workspace

# Copy backend project files
COPY pom.xml ./pom.xml
COPY src ./src

# Build the Spring Boot JAR
RUN mvn -q -DskipTests package

# ---- Runtime stage ----
FROM eclipse-temurin:17-jdk
ENV JAVA_OPTS=""
WORKDIR /app
# Import Amazon RDS/DocumentDB trust bundle into Java truststore (fixes PKIX path building failures)
RUN set -eux; \
		apt-get update; \
		DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends ca-certificates curl; \
		rm -rf /var/lib/apt/lists/*; \
		curl -fsSL https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem -o /tmp/global-bundle.pem; \
		awk 'BEGIN {c=0;} /-----BEGIN CERTIFICATE-----/ {out=sprintf("/tmp/rds-%02d.crt", c++);} {print > out}' /tmp/global-bundle.pem; \
		for cert in /tmp/rds-*.crt; do \
			alias="rds-$(basename "$cert" .crt)"; \
			keytool -importcert -noprompt -storepass changeit -keystore "$JAVA_HOME/lib/security/cacerts" -file "$cert" -alias "$alias" || true; \
		done; \
		rm -f /tmp/global-bundle.pem /tmp/rds-*.crt
COPY --from=build /workspace/target/*.jar /app/app.jar

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]