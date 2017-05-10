# gitlab-hook-server

This small node.js server allow to execute commands on a machine (deployment scripts for example) when a GitLab webhook is triggered (push, issue events, etc..).

The server use a basic configuration file which defines which command should be executed on specific event of a specific repository. The setup time is around 15 minutes.

## Requirements

Node.js (v6 or greater)

## Installation

- Download the content of the current repository
- Execute the following command in the downloaded folder : `npm install`
- Create the file "config.json" and fill it with your configuration (see the server configuration part below)
- If needed, open the port set in the configuration in your firewall in order to allow http request on the server
- Execute the following command in the downloaded folder : `node server.js` (you can also use a process manager like pm2)
- Add the URL of the current server in your gitlab configuration (see the gitlab configuration part below)

## Server configuration

Example of a configuration file :

```
{
  "port": 9000,
  "hooks": [
    {
      "repository": "my-gitlab-repository",
      "event": "push",
      "token": "my-gitlab-token",
      "script": "sh /home/user/deploy.sh"
    }
  ]
}
```

- **port**: The port on which the server is gonna be started
- **hooks**: List of hooks that you want to bind
  - **repository**: Name of the repository on which the script must be bound (optional. if null, the script will be executed on events of all repositories.
  - **event**: Name of the event on which the script will be executed (see the possible values on the [gitlab documentation](https://gitlab.com/help/user/project/integrations/webhooks)) (optional. if null, the script will be executed on all events)
  - **token**: The gitlab token define in the gitlab configuration (see gitlab configuration part below) (optional)
  - **script**: The command to execute when the hook is triggered

## GitLab Configuration

- Open the repository that you want to bind in the gitlab website
- Go to "Settings", and then "Integrations"
- In the URL field, type the address of the hook server : `http://<server-name>:<port>/event`
- Set a token if needed
- Select the event that you want to trigger
- Click on "Add webhook"
- Once the operation done, click on the "Test" button to check if the binding is working
