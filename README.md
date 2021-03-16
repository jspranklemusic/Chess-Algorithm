# Chess-Algorithm
A simple algorithm that can find 2-move checkmates, capture hanging pieces, and do small tactics. This project is not yet complete, and still needs a lot of work, but the basic functionality is there.

### Trying it out
To run this application, download the files and run the HTML file on a server.

### Features

-To prevent a slowdown of the UI when the computer is performing calculations (200,000+ per second), a web worker is implemented. 

-The full rules of chess are implemented

-A simple computer opponent (favoring black) is implemented successfully.

-The computer can scan two moves ahead, find checkmates, capturing hanging pieces, and generally avoid awful blunders most of the time.

### Bugs/Needs Improvement

-I wrote this program before I understood the Javascript ES6 modular import system. It is my intention to reorganize the large file into several smaller components to preserve readability avoid repetition.

-Currently, the computer only favors black.

-All pawns (on the computer side) automatically default to queen, even if there is a possibility of checkmating with a knight promotion.

-In sequences where there are many defenders and many attackers, the computer will sometimes blunder by capturing with a high-ranking piece instead of a lower piece.
