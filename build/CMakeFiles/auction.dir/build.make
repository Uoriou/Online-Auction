# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.31

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:

#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:

# Disable VCS-based implicit rules.
% : %,v

# Disable VCS-based implicit rules.
% : RCS/%

# Disable VCS-based implicit rules.
% : RCS/%,v

# Disable VCS-based implicit rules.
% : SCCS/s.%

# Disable VCS-based implicit rules.
% : s.%

.SUFFIXES: .hpux_make_needs_suffix_list

# Command-line flag to silence nested $(MAKE).
$(VERBOSE)MAKESILENT = -s

#Suppress display of executed commands.
$(VERBOSE).SILENT:

# A target that is always out of date.
cmake_force:
.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /usr/local/bin/cmake

# The command to remove a file.
RM = /usr/local/bin/cmake -E rm -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /Users/m9/Documents/Leipzig/PC/Online-Auction

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /Users/m9/Documents/Leipzig/PC/Online-Auction/build

# Include any dependencies generated for this target.
include CMakeFiles/auction.dir/depend.make
# Include any dependencies generated by the compiler for this target.
include CMakeFiles/auction.dir/compiler_depend.make

# Include the progress variables for this target.
include CMakeFiles/auction.dir/progress.make

# Include the compile flags for this target's objects.
include CMakeFiles/auction.dir/flags.make

CMakeFiles/auction.dir/codegen:
.PHONY : CMakeFiles/auction.dir/codegen

CMakeFiles/auction.dir/test.cpp.o: CMakeFiles/auction.dir/flags.make
CMakeFiles/auction.dir/test.cpp.o: /Users/m9/Documents/Leipzig/PC/Online-Auction/test.cpp
CMakeFiles/auction.dir/test.cpp.o: CMakeFiles/auction.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green --progress-dir=/Users/m9/Documents/Leipzig/PC/Online-Auction/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object CMakeFiles/auction.dir/test.cpp.o"
	/Library/Developer/CommandLineTools/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT CMakeFiles/auction.dir/test.cpp.o -MF CMakeFiles/auction.dir/test.cpp.o.d -o CMakeFiles/auction.dir/test.cpp.o -c /Users/m9/Documents/Leipzig/PC/Online-Auction/test.cpp

CMakeFiles/auction.dir/test.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green "Preprocessing CXX source to CMakeFiles/auction.dir/test.cpp.i"
	/Library/Developer/CommandLineTools/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /Users/m9/Documents/Leipzig/PC/Online-Auction/test.cpp > CMakeFiles/auction.dir/test.cpp.i

CMakeFiles/auction.dir/test.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green "Compiling CXX source to assembly CMakeFiles/auction.dir/test.cpp.s"
	/Library/Developer/CommandLineTools/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /Users/m9/Documents/Leipzig/PC/Online-Auction/test.cpp -o CMakeFiles/auction.dir/test.cpp.s

# Object files for target auction
auction_OBJECTS = \
"CMakeFiles/auction.dir/test.cpp.o"

# External object files for target auction
auction_EXTERNAL_OBJECTS =

auction: CMakeFiles/auction.dir/test.cpp.o
auction: CMakeFiles/auction.dir/build.make
auction: /usr/local/lib/libcpr.1.11.1.dylib
auction: /Library/Developer/CommandLineTools/SDKs/MacOSX15.2.sdk/usr/lib/libcurl.tbd
auction: CMakeFiles/auction.dir/link.txt
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green --bold --progress-dir=/Users/m9/Documents/Leipzig/PC/Online-Auction/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Linking CXX executable auction"
	$(CMAKE_COMMAND) -E cmake_link_script CMakeFiles/auction.dir/link.txt --verbose=$(VERBOSE)

# Rule to build all files generated by this target.
CMakeFiles/auction.dir/build: auction
.PHONY : CMakeFiles/auction.dir/build

CMakeFiles/auction.dir/clean:
	$(CMAKE_COMMAND) -P CMakeFiles/auction.dir/cmake_clean.cmake
.PHONY : CMakeFiles/auction.dir/clean

CMakeFiles/auction.dir/depend:
	cd /Users/m9/Documents/Leipzig/PC/Online-Auction/build && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /Users/m9/Documents/Leipzig/PC/Online-Auction /Users/m9/Documents/Leipzig/PC/Online-Auction /Users/m9/Documents/Leipzig/PC/Online-Auction/build /Users/m9/Documents/Leipzig/PC/Online-Auction/build /Users/m9/Documents/Leipzig/PC/Online-Auction/build/CMakeFiles/auction.dir/DependInfo.cmake "--color=$(COLOR)"
.PHONY : CMakeFiles/auction.dir/depend

