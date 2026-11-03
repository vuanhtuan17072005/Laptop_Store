const floatingButton = document.getElementById('floating-button');
const advisorList = document.getElementById('advisor-list');

if (floatingButton && advisorList) {
    floatingButton.addEventListener('click', function () {
        advisorList.classList.toggle('show');
    });
}

document.addEventListener('DOMContentLoaded', function () {

    const floatingButton =
        document.getElementById('floating-button');

    const advisorList =
        document.getElementById('advisor-list');

    if (floatingButton && advisorList) {

        floatingButton.addEventListener('click', function () {

            advisorList.classList.toggle('show');

        });

    }

    fetch('http://localhost:8080/user/employee')
        .then(response => response.json())
        .then(data => {

            if (!advisorList) return;

            advisorList.innerHTML = '';

            data.forEach(employee => {

                const advisorDiv =
                    document.createElement('div');

                advisorDiv.classList.add('advisor');

                const nameParts =
                    employee.name.split(' ');

                const initials =
                    nameParts
                        .map(part =>
                            part.charAt(0).toUpperCase())
                        .join('');

                const iconColor = getRandomColor();

                const iconDiv =
                    document.createElement('div');

                iconDiv.classList.add('advisor-icon');

                iconDiv.textContent = initials;

                iconDiv.style.backgroundColor =
                    iconColor;

                advisorDiv.appendChild(iconDiv);

                const advisorInfo =
                    document.createElement('p');

                advisorInfo.innerHTML =
                    `${employee.name}: 
                    <span>
                        Số điện thoại:
                        ${employee.phoneNumber}
                    </span>`;

                advisorDiv.appendChild(advisorInfo);

                const closeBtn =
                    document.getElementById(
                        'close-advisor-list'
                    );

                if (closeBtn) {

                    advisorList.insertBefore(
                        advisorDiv,
                        closeBtn
                    );

                } else {

                    advisorList.appendChild(advisorDiv);

                }

            });

        })
        .catch(error =>
            console.error(
                'Có lỗi khi gọi API:',
                error
            )
        );

});


function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
