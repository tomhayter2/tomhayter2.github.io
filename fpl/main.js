(async function() {
    var max_week = 0;

    var players  = [
        {
            label: 'Tom',
            id: 3882927
        },
        {
            label: 'Paul',
            id: 151823
        },
        {
            label: 'Jerry',
            id: 4083398
        },
        {
            label: 'Jimmy',
            id: 5625792
        },
        {
            label: 'Dave',
            id: 1951186
        },
        {
            label: 'Erdemir',
            id: 6752737
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
