cmake_minimum_required(VERSION 3.10)
project(CrowToDjangoAPI)

set(CMAKE_CXX_STANDARD 17)

set(CPR_INCLUDE_DIR "/usr/local/opt/cpr/include")
set(CPR_LIBRARY_DIR "/usr/local/opt/cpr/lib")

# Find cpr package
find_package(cpr REQUIRED)

# Add executable
add_executable(auction test.cpp)

# Link cpr library
target_link_libraries(auction PRIVATE cpr::cpr)

