# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY LibriFreeBack/LibriFreeBack.csproj LibriFreeBack/
COPY global.json .

# Restore dependencies
RUN dotnet restore LibriFreeBack/LibriFreeBack.csproj

# Copy the rest of the code
COPY . .

# Build the application
WORKDIR /src/LibriFreeBack
RUN dotnet build LibriFreeBack.csproj -c Release -o /app/build

# Publish the application
RUN dotnet publish LibriFreeBack.csproj -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Create directory for database
RUN mkdir -p /app/data

# Copy published files from build stage
COPY --from=build /app/publish .

# Copy appsettings.json.example as appsettings.json for configuration
COPY --from=build /src/LibriFreeBack/appsettings.json.example /app/appsettings.json

# Expose port
EXPOSE 5051

# Set environment variables
ENV ASPNETCORE_URLS=http://+:5051
ENV ASPNETCORE_ENVIRONMENT=Development

# Run the application
ENTRYPOINT ["dotnet", "LibriFreeBack.dll"]
