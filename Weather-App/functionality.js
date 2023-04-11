const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]',);

const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    if (currentTheme === 'light') {
        document.querySelector('#darkmode').href = '';
    }

    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
        document.querySelector('#darkmode').href = 'darkmode.css';
    }
}

function switchTheme(event) {
    if (event.target.checked) {
        document.querySelector('#darkmode').href = 'darkmode.css';
        localStorage.setItem('theme', 'dark');
    } else {
        document.querySelector('#darkmode').href = '';
        localStorage.setItem('theme', 'light');
    }
}

toggleSwitch.addEventListener('change', switchTheme);