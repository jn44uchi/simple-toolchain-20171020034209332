google.load('visualization', '1', { packages : [ 'corechart' ]});
google.setOnLoadCallback(drawChart);

function drawChart(){
     // 表示するデータの設定
    var data = new google.visualization.DataTable();
    data.addColumn('string', '日');
    data.addColumn('number', '歩数');
    data.addColumn('number', '乗車時間');
    data.addColumn('number', '消費カロリー');

    data.addRows([
        ["12月8日",  7432,  80, 2199], 
        ["12月9日",  5474,  54, 2069], 
        ["12月10日", 5751,  56, 2075], 
        ["12月11日", 6037, 109, 2161], 
        ["12月12日", 7402,  72, 2359], 
        ["12月13日",  532,  16, 2023], 
        ["12月14日", 5188,  91, 2093]
    ]);

    // グラフの設定
    var option = {
        title: 'Lifelogでとったデータ',
        width: '100%',
        height: '100%',
        series: [
            { type: 'bars', targetAxisIndex: 0 },
            { type: 'line', targetAxisIndex: 1 },
            { type: 'area', targetAxisIndex: 2 }
        ],
        vAxes: [
            { title: '歩数(歩)' },
            { title: '乗車時間（分）' }, 
            { title: '消費カロリー（kcal）' }
        ]
    };

    var chart = new google.visualization.ComboChart(document.getElementById('chart'));
    chart.draw(data, option);
}