# YouTube Music Api

This project is a YouTube Music Api that uses both Express.js and Flask. The Express.js application serves as the main server, while the Flask application handles the conversion of YouTube videos to audio.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- Python
- Flask
- Express.js

### Installing

1. Clone the repository: git clone https://github.com/yourusername/your-repo-name.git

2. Install Node.js dependencies: cd your-repo-name npm install 

3. Install Python dependencies: pip install -r requirements.txt

4. Start the Express.js server: node index.js

5. Start the Flask server: python main.py

Now you can make requests to `http://localhost:5000/api/express` for the Express.js server and `http://localhost:5000/api/flask/convert` for the Flask server.

## Built With

- [Express.js](https://expressjs.com/) - The web framework used
- [Flask](https://flask.palletsprojects.com/) - Used to handle YouTube to audio conversion
- [pytube](https://python-pytube.readthedocs.io/en/latest/) - A lightweight, dependency-free Python library for downloading YouTube Videos.



