const inquirer = require("inquirer");
const { getUserInfo, getRepos, listCommits, listOneCommit, repoRatings, repoOneRating } = require("./app/utils/githubFunc.js");

let username, token, repoName;

async function userType() 
{
    const { userType } = await inquirer.prompt([
        {
            type: "list",
            name: "userType",
            message: "Choose your preference : ",
            choices: [
                "1. Normal user",
                "2. Authenticated user\n"
            ],
        }
    ]);
    return userType;   
}

async function userName()
{
    const { name } = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Enter your github account username : ",
        }
    ]);
    return name;
}

async function authenticatedUser()
{
    const { token } = await inquirer.prompt([
        {
            type: "input",
            name: "token",
            message: "Enter your github access token : ",
        }
    ]);
    return token;
}

async function repoNames(repos)
{
    const { repoName } = await inquirer.prompt([
        {
            type: "list",
            name: "repoName",
            message: "Choose your repository: ",
            choices: repos.map(repo => repo.name),
        }
    ]);
    return repoName;
}

async function main() 
{
    let exit = false;
    while(!exit)
    {
        const { action } = await inquirer.prompt([
            {
                type: "list",
                name: "action",
                message: "Choose your action: ",
                choices: [
                    "1. View user info",
                    "2. List all repositories",
                    "3. List latest commits in repostories",
                    "4. List latest commit in particular repositpory",
                    "5. View ratings of repository",
                    "6. View ratings of particular repository",
                    "7. Exit\n",
                ],
            }
        ]);

        switch(action)
        {
            case "1. View user info":
                var typeOfUser = await userType();
                if(typeOfUser == '1. Normal user')
                {
                    username = await userName();
                    // console.log("Username = ", username);
                    if(username == "" || username == undefined) return console.error(`Username cannot be empty!`);
                    let user = await getUserInfo(username);
                    console.log("User = ", user);
                    break;
                }
                else if(typeOfUser == '2. Authenticated user\n')
                {
                    username = await userName();
                    if(username == "" || username == undefined) return console.error(`Username cannot be empty!`);
                    token = await authenticatedUser();
                    if(token == "") return console.error(`Token is required`);
                    let user = await getUserInfo(username, token);
                    console.log("User = ", user);
                    break;
                }
                else
                {
                    return console.error("Invalid choice!");
                }
            
            case "2. List all repositories":
                if(typeOfUser == undefined) 
                {
                    var typeOfUser = await userType();
                }
                if(typeOfUser == '1. Normal user')
                {
                    if(username == "" || username == undefined)
                    {
                        username = await userName();
                        if(username == "") return console.error(`Username cannot be empty!`);
                    }
                    var repos = await getRepos(username);
                    console.log("Repositories = ", repos);
                    break;
                }
                else if(typeOfUser == '2. Authenticated user\n')
                {
                    if(username == "" || username == undefined)
                    {
                        username = await userName();
                        if(username == "") return console.error(`Username cannot be empty!`);
                    }
                    if(token == "" || token == undefined)
                    {
                        token = await authenticatedUser();
                        if(token == "") return console.error(`Token is required`);
                    } 
                    var repos = await getRepos(username, token);
                    console.log("Repositories = ", repos);
                    break;
                }

            case "3. List latest commits in repostories":
                if(username == "" || username == undefined) return console.error(`Username cannot be empty!`);
                
                let repoCommits = await listCommits(username, token);
                console.log("Repo commits = ", repoCommits);
                break;
            
            case "4. List latest commit in particular repositpory":
                if(username == "" || username == undefined) return console.error(`Username cannot be empty!`);
                
                repos = await getRepos(username, token);
                repoName = await repoNames(repos);
                // console.log("Repo commit = ", repoName);
                let commitInfo = await listOneCommit(username, token, repoName);
                console.log("Commit Details = ", commitInfo);
                break;
            
            case "5. View ratings of repository":
                if(username == "" || username == undefined) return console.error(`Username cannot be empty!`);

                let reposRatings = await repoRatings(username, token);
                console.log("Repos Ratings = ", reposRatings);
                break;
            
            case "6. View ratings of particular repository":
                if(username == "" || username == undefined) return console.error(`Username cannot be empty!`);
                
                repos = await getRepos(username, token);
                repoName = await repoNames(repos);
                // console.log("Repo commit = ", repoName);
                let owner = repos.filter((repo)=> {
                    if(repo?.name == repoName) return repo?.owner;
                });
                owner = owner[0].owner;
                // console.log("Owner = ", owner);
                let repoRating = await repoOneRating(owner, token, repoName);
                console.log("Repository ratings = ", repoRating);
                break;
            
            case "7. Exit\n":
                exit = true;
                console.log("...Successfull Exit...");
                break;
            
            default: 
                console.log("Invalid choice!");
                break;
        }
    }
}
main();