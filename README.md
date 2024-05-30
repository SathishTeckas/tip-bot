# Aurora Tipbot Frontend

This is the frontend for the Aurora Tipbot, a web-based application that allows users to tip cryptocurrency to each other on the Aurora network. The application is built using React and Redux, and communicates with the nextjs API via HTTP requests.

## Installation

### To install the project, follow these steps:

1.Clone the repository to your local machine:

```
git clone https://github.com/Teckas-Technologies/aurora-tipbot-frontend.git
```

2.Navigate to the project directory:

```
cd aurora-tipbot-frontend
```

3.Install the project dependencies:

```
npm install
```

4.Run the project in development mode:

```
npm start
```

The application should now be running on http://localhost:3000.

## Deploying to AWS EC2 Instance

### To deploy the application to an AWS EC2 instance, follow these steps:

1.Create a new EC2 instance with your desired configuration.
2.Connect to the instance via SSH.
3.Install Git and Node.js:

```
sudo apt-get update
sudo apt-get install git
sudo apt-get install nodejs
```

4.Clone the repository to the instance:

```
git clone https://github.com/Teckas-Technologies/aurora-tipbot-frontend.git
```

5.Navigate to the project directory:

```
cd aurora-tipbot-frontend
```

6.Install the project dependencies:

```
npm install
```

7.Build the project:

```
npm run build
```

8.Start the server using PM2:

```
sudo pm2 start npm --name "aurora-tip-bot-frontend" -- run start -- --port=3000
```
