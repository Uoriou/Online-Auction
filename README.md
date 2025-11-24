# :moneybag: Online-Auction

## :books: Project Overview

"eBid", a budding online auction platform, allows users to list items for auction and enable
real-time bidding. The platform tracks timers and automatically determine the winning bid when the auction ends. 
Both the seller and the winning bidder should receive notifications.

## ⚙️ Technical Requirements:
To run Online-Auction, please ensure that your system meets the following requirements:

- Operating System: Windows, macOS, or Linux
- Docker / Docker desktop 

## :computer: Libraries / Technologies Used:

- Python Django REST framework (User management, Authentication and base mvc)
- JWT (Authentication)
- Java Spring Boot (Websocket)
- PostgreSQL server (Persistent data storage)
- React Typescript (Frontend)
- Docker (Server deployment)

  [![My Skills](https://skillicons.dev/icons?i=py,django,java,spring,postgres,react,ts,docker&perline=3)](https://skillicons.dev)
  [![Python](https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg)](https://www.python.org)
  [![JavaScript](https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg)](https://developer.mozilla.org/docs/Web/JavaScript)


## :pushpin: Project Structure

```bash 
 
  ├── online_auction #Java, Python backend
  ├── online_auction_frontend # React.js
  ├── dockerignore #Docker ignore file 
  ├── gitignore #Ignore 
  └── README.md
```
  
## 🔧 Installation Guidline
> [!NOTE]
> This project is deployed on Docker.

- Please install Docker desktop: [Docker desktop](https://www.docker.com/products/docker-desktop/)
- Make sure to clone this Online-Auction repository:
```bash
  git clone https://github.com/Uoriou/Online-Auction.git
```
## ⏩ Run the application using the docker image

Once Docker / Docker desktop is installed, make sure to navigate to where docker-compose.yml file is located to run the project using this command: 
```bash 
    docker compose up -d --build 
```

Make sure to run the project container. 

Once the container is up and running, go back to where python-backend is located and create a superuser
to access the default Django admin panel 
```bash
   docker compose exec python-backend python3 manage.py createsuperuser
```
Then apply the Django databse migrations:

```bash
  docker compose exec python-backend python3 manage.py makemigrations
  docker compose exec python-backend python3 manage.py migrate
```

Access the application at: 
``` bash
    localhost:3000/login 
```

To stop the application run:
```bash
  docker compose down
```
