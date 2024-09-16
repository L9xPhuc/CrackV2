const sheetId = '1rzHdXeodyCZ34IBU8_QlLodv-SNAnJqepUkPEVoiEyk';
const gameDataRange = 'GameData!A:Z';
const apiKey = 'AIzaSyAq7sEvz245Qdp-ED_H64nniECdJV7sNFg';

let allGames = [];
let specialGames = [];
let filteredGames = [];
let showSpecialOnly = false;
let searchQuery = '';

// Chạy khi DOM đã tải xong
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});

function fetchData() {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${gameDataRange}?key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const rows = data.values;
            allGames = [];
            specialGames = [];
            rows.forEach((row, index) => {
                if (index === 0) return;
                let game = {
                    title: row[0],
                    image: row[1],
                    vietnamese: row[11] && row[11].toLowerCase() === 'có',
                };
                allGames.push(game);
                if (game.vietnamese) {
                    specialGames.push(game);
                }
            });
            filterGames();
        })
        .catch(error => console.error('Error fetching game data: ', error));
}

function filterGames() {  // Sửa tên hàm đúng
    filteredGames = allGames.filter(game => {
        let matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
        let matchesSpecial = !showSpecialOnly || game.vietnamese;
        return matchesSearch && matchesSpecial;
    });
    displayGames();  // Gọi hàm hiển thị danh sách game
}

function displayGames() {
    const gameList = document.getElementById('game-list');
    gameList.innerHTML = '';
    filteredGames.forEach(game => {
        let html = `<div class="game-item" onclick="redirectToGameDetail('${game.title}')">
                        <h2>${game.title}</h2>
                        <img src="${game.image}" alt="${game.title}" class="game-image"/>
                    </div>`;
        gameList.innerHTML += html;
    });
}

function redirectToGameDetail(gameTitle) {
    window.location.href = `detail.html?game=${encodeURIComponent(gameTitle)}`;
}

document.getElementById('toggle-special').addEventListener('change', (event) => {
    showSpecialOnly = event.target.checked;
    filterGames();
})

document.getElementById('search-button').addEventListener('click', () => {
    searchQuery = document.getElementById('search-box').value;
    filterGames();
});

document.getElementById('search-box').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchQuery = event.target.value;
        filterGames();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('note-popup').classList.add('show');
    document.getElementById('overlay').classList.add('show');
    document.body.classList.add('no-scroll');
});

document.getElementById('close-note').addEventListener('click', () => {
    document.getElementById('note-popup').classList.remove('show');
    document.getElementById('overlay').classList.remove('show');
    document.body.classList.remove('no-scroll');
});