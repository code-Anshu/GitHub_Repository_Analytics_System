const axios = require("axios");
require("dotenv").config();

let GITHUB_API = process.env.GITHUB_API || "https://api.github.com";
let page = 1;
const perPage = 100;

async function getUserInfo(username, token)
{
    try
    {
        // console.log("welcome ", username);
    
        const user = await axios.get(GITHUB_API+`/users/${username}`,{
            headers: token ? { 'Authorization': `token ${token}`} : {}
        });
        // console.log("User = ", user.data);
        return user.data;
    }
    catch(err)
    {
        return console.error(`Error fetching user info : ${err}`);
    }
}

async function getRepos(username, token)
{
    try
    {
        // console.log("In get repo, hello ", username);
        let userRepos;
        (token)? userRepos = await axios.get(GITHUB_API+`/user/repos`, {
            headers: {
                'Authorization': `token ${token}`
            },
        }) : userRepos = await axios.get(GITHUB_API+`/users/${username}/repos`);
        // console.log("User repositories = ", userRepos.data);
        let reposName = [];
        for(let repo of userRepos.data)
        {
            reposName.push({ name : repo?.name, owner: repo?.owner?.login, visibility: repo?.visibility});
        }
    
        // console.log("Repos Name = ", reposName);
        return reposName;
    }
    catch(err)
    {
        return console.error(`Error displaying repositories ${err}`);
    }
}

async function listCommits(username, token) 
{
    try
    {  
        let repos = await getRepos(username, token);
        // console.log("REpos = ", repos);
        let repoCommits = [];
        for(let repo of repos)
        {
            let commit = await listOneCommit(username, token, repo?.name);
            if(commit == undefined) continue;
            // console.log("Commit = ", commit);
            repoCommits.push(commit);
    
        }
        // console.log("Latest repo commits = ", repoCommits);
        return repoCommits;
    }
    catch(err)
    {
        return console.error(`Error lisiting all repostories commits : ${err}`);
    }
}

async function listOneCommit(username, token, repoName)
{
    try { 
        // console.log("commits_url ", repoName);
        const latestComm = await axios.get(GITHUB_API+`/repos/${username}/${repoName}/commits`,{
            headers: token ? { 'Authorization': `token ${token}`} : {},
            params: { per_page: perPage, page } 
        });
        // console.log("Latest commit = ", latestComm.data[0]);

        return { [repoName] : {
            id: latestComm.data[0]?.sha, 
            // author_id: obj?.author?.id, 
            author: latestComm.data[0]?.commit?.author.name,
            author_email: latestComm.data[0]?.commit?.author.email, 
            commit_date: latestComm.data[0]?.commit?.committer?.date, 
            message: latestComm.data[0]?.commit?.message,
            }
        }
    }
    catch(err)
    {
        return console.error(`Error listing commit in repository: ${err}`);
    }
}

async function repoRatings(owner, token) 
{
    try
    {
        let repos = await getRepos(owner, token);
        const reposRating = await Promise.all(repos.map(async(repo)=>{
            const repoRate = await repoOneRating(owner, token, repo.name);
            return repoRate;
        }));
        return reposRating;
    }
    catch(err)
    {
        return console.error(`Error displaying ratings of all repository: ${err}`);
    }
}

async function repoOneRating(owner, token, repoName) 
{
    try
    {
        const ratings = await axios.get(GITHUB_API + `/user/starred/${owner}/${repoName}`,{
              headers: {
                'Authorization': `token ${token}`
            },
            validateStatus: false,
        });
        // console.log("Ratings = ", ratings.data);  
        if(parseInt(ratings.data.status) >= 200 && parseInt(ratings.data.status) <= 400)
        {
            return `${repoName} is rated`;
        }
        else 
        {
            return `${repoName} isn't rated!`;
        }
        // return ratings.data;
    }
    catch(err)
    {
        return console.error(`Error displaying rating of repository: ${err}`);
    }
}

module.exports = {
    getUserInfo, getRepos, listCommits, listOneCommit, repoRatings, repoOneRating
}