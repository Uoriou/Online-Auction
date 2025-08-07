# Online-Auction

## Project Overview

## Technical Requirements:
To run Online-Auction, please ensure that your system meets the following requirements:

- Operating System: Windows, macOS, or Linux
- Docker / Docker desktop 

## Libraries / Technologies Used:

- Python Django REST framework 
- Java Spring Boot 
- PostgreSQL server
- React Typescript
- Docker

  [![My Skills](https://skillicons.dev/icons?i=react,vue,flutter&perline=3)](https://skillicons.dev)

## Installation Guidline
This project is deployed on Docker, therefore 

- Please install Docker desktop: https://www.docker.com/products/docker-desktop/
- Make sure to clone this Online-Auction repository

## Run the docker image

Once Docker is installed, it is possible to use the .yml file of this project to build the docker image to run the project using this command: 
```bash 
    docker compose up -d --build 
```

Make sure to run the project container. 

Once the container is up and running, go back to where python-backend is located and create a superuser
to access the default Django admin panel 
```bash
   docker-compose web exec python3 manage.py createsuperuser
```
Then apply the Django databses changes:

```bash
  docker compose exec python-backend python3 manage.py migrate
```


Access the application at: 
``` bash
    http://localhost:3000/login 
```
