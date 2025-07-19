FROM gcc:latest 

RUN apt-get update && apt-get install -y \
    g++ \
    cmake \
    git \
    build-essential \
    libboost-system-dev \
    libboost-thread-dev \
    libboost-date-time-dev \
    libasio-dev \
    libssl-dev \
    zlib1g-dev \
    libpqxx-dev \ 
    libcurl4-openssl-dev \
    && rm -rf /var/lib/apt/lists/*
   

WORKDIR /app

RUN git clone --recursive https://github.com/libcpr/cpr.git /cpr \
    && cd /cpr \
    && cmake -S . -B build -DCPR_USE_SYSTEM_CURL=ON -DBUILD_SHARED_LIBS=OFF -DCMAKE_USE_OPENSSL=ON \
    && cmake --build build && cmake --install build

RUN mkdir -p /usr/local/include/nlohmann \
    && curl -L https://github.com/nlohmann/json/releases/latest/download/json.hpp -o /usr/local/include/nlohmann/json.hpp

RUN git clone --depth=1 https://github.com/CrowCpp/Crow.git || \
(echo "Retrying..." && sleep 3 && git clone --depth=1 https://github.com/CrowCpp/Crow.git)

COPY . /app

#RUN g++ -o backend backend.cpp -std=c++17 -pthread -lcpr -lcurl -lboost_system -lssl -lcrypto -I/app/Crow/include -I/usr/include -DASIO_STANDALONE
RUN g++ -o backend backend.cpp -std=c++17 -pthread -lcpr -lcurl -lboost_system -lssl -lcrypto -lpqxx -lpq -I/app/Crow/include -I/usr/include -DASIO_STANDALONE

RUN ls -l backend && file backend
EXPOSE 9999
CMD ["./backend"]
