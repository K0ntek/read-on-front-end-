var title = [
    '"Czytanie dobrych książek jest niczym rozmowa z najwspanialszymi ludźmi minionych czasów"',
    '"Ludzie mówią, że życie to jest to, ale ja wolę sobie poczytać"',
    '"Książka jest niczym ogród, który można włożyć do kieszeni"',
    '"Książka i możliwość czytania, to jeden z największych cudów ludzkiej cywilizacji."',
    '"Kiedy przeczytam nową książkę, to tak jakbym znalazł nowego przyjaciela, a gdy przeczytam książkę, którą już czytałem - to tak jakbym spotkał się ze starym przyjacielem."'
];

//jak ktos to zmieni zajebie

const textEl = document.getElementById("titleText");

const update = () => {
    const randomTitle = title[Math.floor(Math.random() * title.length)];
    textEl.style.opacity = 0;
    setTimeout(function () {
        document.getElementById("titleText").textContent = randomTitle;
        textEl.style.opacity = 1;
    }, 1000);
};

setInterval(update, 5000);
update();
