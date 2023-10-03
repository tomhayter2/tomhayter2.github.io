(async function() {
    var max_week = 0;

    var players  = [
        {
            label: 'Tom',
            id: 5314165
        },
        {
            label: 'Paul',
            id: 83518
        },
        {
            label: 'Jerry',
            id: 2430277
        },
        {
            label: 'Jimmy',
            id: 4491334
        },
        {
            label: 'Dave',
            id: 4539963
        },
        {
            label: 'Erdemir',
            id: 3612853
        },
        {
            label: 'Jordan',
            id: 3601687
        },
        {
            label: 'Nat',
            id: 6548687
        }
    ];

    await Promise.all(
        players.map(player => fetch('https://corsproxy.io/?https://fantasy.premierleague.com/api/entry/' + player.id +'/history/')
            .then(r => r.json())
            .then(r => {
                var scores = [];
                max_week = Math.max(...r.current.map(o => o.event));

                for (var i = 1; i <= max_week; i++) {
                    var event = r.current.filter(function(e){return e.event == i});
                    event.length > 0
                        ? scores.push(event[0].total_points)
                        : scores.push(0);
                }

                player.data = scores;
            })
            .catch(error => ({ error, url }))
        )
    )

    new Chart(
        document.getElementById('fpl'),
            {
                type: 'line',
                data: {
                    labels: Array.from({length:max_week},(v,k)=>k+1),
                    datasets: players
                }
            }
    );
})();
