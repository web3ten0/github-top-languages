# github-top-languages

Use Node.js to fetch and display the percentage of languages used in your GitHub repositories.

## Usage

### Install

```shell
git clone https://github.com/web3ten0/github-top-languages.git
cd github-top-languages
npm install
cp .env.example .env
```

### Get Github AccessToken

#### Generate new token

- Settings > Developer settings > Personal access tokens > Tokens(classic) > Generate new token (classic)

#### Select scopes

- select `repo`

### Update .env

```
GITHUB_ACCESS_TOKEN=**********
GITHUB_USERNAME=*****
IGNORE_LANGUAGES=HTML,CSS,Shell,Vim Script,Mathematica,ShaderLab
MAX_PAGE=10
SHOW_NUM=10
```

| Variable Name       | Description                                                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| GITHUB_ACCESS_TOKEN | The GitHub access token obtained in the previous steps                                                                       |
| GITHUB_USERNAME     | Your GitHub username                                                                                                         |
| IGNORE_LANGUAGES    | A comma-separated string of languages to exclude from the statistics (e.g., HTML,CSS,Shell,Vim Script,Mathematica,ShaderLab) |
| MAX_PAGE            | The maximum number of repository pages to fetch (1 page contains 100 repositories)                                           |
| SHOW_NUM            | The maximum number of languages to display                                                                                   |

### Execution

```shell
npm run exec
```

### Output Example

```shell
1. Rust 22.66%
2. TypeScript 14.49%
3. JavaScript 13.82%
4. Vue 10.54%
5. C++ 3.26%
6. Go 2.86%
7. HLSL 1.05%
8. Dockerfile 0.44%
9. Solidity 0.27%
10. Python 0.22%
```

## License

MIT
