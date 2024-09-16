const sheetId = '1rzHdXeodyCZ34IBU8_QlLodv-SNAnJqepUkPEVoiEyk';
const gameDataRange = 'GameData!A:Z';  // Phạm vi dữ liệu game
const updateDataRange = 'UpdateData!A:Z';  // Phạm vi dữ liệu bản cập nhật
const backupLinksRange = 'BackupLinks!A:Z'; // Phạm vi dữ liệu liên kết dự phòng
const apiKey = 'AIzaSyAq7sEvz245Qdp-ED_H64nniECdJV7sNFg';

let currentGame = {};
let backupLinks = {};

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const gameName = getQueryParam('game');

if (gameName) {
    document.title = gameName;
}

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});

function fetchData() {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${gameDataRange}?key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const rows = data.values || [];  // Đảm bảo rows không undefined
            const gameData = rows.find(row => row[0] === gameName);

            if (gameData) {
                currentGame = {
                    title: gameData[0],
                    image: gameData[1],
                    minRequirements: gameData[2],
                    recRequirements: gameData[3],
                    version: gameData[4],
                    description: gameData[5],
                    releaseDate: gameData[6],
                    updateDate: gameData[7],
                    devLink: gameData[8],
                    pubLink: gameData[9],
                    multiplayer: gameData[10],
                    vietnamese: gameData[11],
                    vietnameseLink: gameData[12],
                    updateLinks: gameData[13],
                    oldVersionLinks: gameData[14],
                    newVersionLinks: [  // Sửa tên thuộc tính
                        gameData[15], gameData[16], gameData[17], gameData[18],
                        gameData[19], gameData[20], gameData[21], gameData[22],
                        gameData[23], gameData[24], gameData[25], gameData[26],
                        gameData[27], gameData[28], gameData[29], gameData[30]
                    ]
                };
                
                displayGameInfo();
                fetchBackupLinks();
            }
        })
        .catch(error => console.error('Error fetching game data: ', error));
}

function fetchBackupLinks() {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${backupLinksRange}?key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const rows = data.values || [];  // Đảm bảo rows không undefined
            backupLinks = {};
            rows.forEach((row, index) => {
                if (index === 0) return;
                let gameTitle = row[0];
                let partNumber = row[1];
                let links = row.slice(2).filter(link => link);
                if (!backupLinks[gameTitle]) {
                    backupLinks[gameTitle] = {};
                }
                backupLinks[gameTitle][partNumber] = links;
            });
        })
        .catch(error => console.error('Error fetching backup links: ', error));
}

function displayGameInfo() {
    document.getElementById('game-name').textContent = currentGame.title;
    document.getElementById('game-image').src = currentGame.image;
    document.getElementById('game-description').innerHTML = formatTextWithNewLines(currentGame.description);
    document.getElementById('min-req').innerHTML = formatTextWithNewLines(currentGame.minRequirements);
    document.getElementById('rec-req').innerHTML = formatTextWithNewLines(currentGame.recRequirements);
    
    document.getElementById('release-date').textContent = currentGame.releaseDate;
    document.getElementById('update-date').textContent = currentGame.updateDate;
    document.getElementById('version').textContent = currentGame.version;
    document.getElementById('dev-link').href = currentGame.devLink;
    document.getElementById('dev-link').textContent = currentGame.devLink ? "Nhà phát triển" : '';
    document.getElementById('pub-link').href = currentGame.pubLink;
    document.getElementById('pub-link').textContent = currentGame.pubLink ? "Nhà xuất bản" : '';
    document.getElementById('multiplayer').textContent = currentGame.multiplayer;
    
    const vietnameseLinkElement = document.getElementById('vietnamese-link');    updateDownloadLinks('new-version-links', currentGame.newVersionLinks);
    updateDownloadLinks('old-version-links', currentGame.oldVersionLinks);
    updateDownloadLinks('update-links', currentGame.updateLinks);

    if (vietnameseLinkElement && currentGame.vietnameseLink) {
        vietnameseLinkElement.innerHTML = `<p>Việt hóa: <a href="${currentGame.vietnameseLink}" target="_blank">Tải về</a></p>`;
    }}

function updateDownloadLinks(elementId, links) {
    const listElement = document.getElementById(elementId);
    listElement.innerHTML = ''; // Xóa các liên kết hiện tại
    if (Array.isArray(links)) {
        links.forEach((link, index) => {
            if (link) {
                let listItem = document.createElement('li');
                let anchor = document.createElement('a');
                anchor.href = link;
                anchor.textContent = `Tải về phần ${index + 1}`;
                listItem.appendChild(anchor);
                listElement.appendChild(listItem);
            }
        });
    }
}

function formatTextWithNewLines(text) {
    return text ? text.replace(/\n/g, '<br>') : '';
}
