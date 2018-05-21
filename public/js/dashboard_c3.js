// C3.jsを使ったダッシュボード

var allJsonData;
var selectJsonData;

// json取得
var getJson = function(dataNum) {
	var begin = new Date().getTime();
	$.ajax({
		url: './data/data' + dataNum + '.json',
		type: 'GET',
		dataType: 'json'
	}).done(function(data, textStatus, jqXHR) {
		allJsonData = data;
		selectJsonData = data;
		log2console('get json text from server time : ' + (new Date().getTime() - begin) + '(ms)');
		drawChart();
	}).fail(function(jqXHR, textStatus, errorThrown) {
		log2console('' + textStatus);
	});
};

// グラフ描画
var drawChart = function() {
	var begin = new Date().getTime();
	// C3.jsで描画
	var chart = c3.generate({
		data: {
			json: selectJsonData,
			keys: {
				x: 'balance',
				value: ['profit']
			},
			//			xs : {
			//				balance: 'profit'
			//			},
			type: 'scatter',
			onclick: function(d, element) {
				var cur = searchByXY(d.x, d.value);
				window.alert('ここでリンク起動するイメージです。' + cur.comName);
			}
		},
		axis: {
			x: {
				label: '残高',
				tick: {
					fit: false
				}
			},
			y: {
				label: '収益'
			}
		},
		tooltip: {
			contents: function(d, defaultTitleFormat, defaultValueFormat, color) {
				var tooltipHtml = "";

				for (let i = 0; i < d.length; i++) {
					if (!(d[i] && (d[i].value || d[i].value === 0))) {
						continue;
					}
					var cur = searchByXY(d[i].x, d[i].value);
					tooltipHtml += cur.comName + ' 残高:' + cur.balance + ' 収益:' + cur.profit;
				}
				return tooltipHtml;
			}
		},
		subchart: {
			show: true
		},
		zoom: {
			enabled: true
		},
		grid: {
			x: {
				show: true
			},
			y: {
				show: true
			}
		},
		point: {
			r: 5
		}
	});
	log2console('draw chart time : ' + (new Date().getTime() - begin) + '(ms)');
};

// 座標からデータ検索(tooptipやonclickのコールバック引数では正しいindexが取得できない・・・)
var searchByXY = function(x, y) {
	var ret;
	for (var i = 0; i < selectJsonData.length; i++) {
		var cur = selectJsonData[i];
		if (cur.balance === x && cur.profit === y) {
			ret = cur;
			break;
		}
	};
	return ret;
};

// ログ
var log2console = function(msg) {
	if (console) {
		console.log(msg);
	}
};

// 初期化
var startUp = function() {
	var dataNum = $('#dataNum').val();
	getJson(dataNum);
};

// kick
$(document).ready(function() {
	// プルダウンアクション
	// データ件数
	$('#dataNum').on('change', function() {
		startUp();
	});

	// 業種別
	$('#bizCategory').on('change', function() {
		var curSelect = $('#bizCategory').val();
		if (!curSelect) {
			selectJsonData = allJsonData;
		} else {
			selectJsonData = [];
			allJsonData.reduce(function(prev, cur) {
				if (cur.bizCategory === curSelect) {
					selectJsonData.push(cur);
				}

			});
		}
		drawChart();
	});

	// 地域別
	$('#area').on('change', function() {
		var curSelect = $('#area').val();
		if (!curSelect) {
			selectJsonData = allJsonData;
		} else {
			selectJsonData = [];
			allJsonData.reduce(function(prev, cur) {
				if (cur.area === curSelect) {
					selectJsonData.push(cur);
				}
			});
		}
		drawChart();
	});

	// グループ別
	$('#group').on('change', function() {
		window.alert('グループ単位のデータで再集計するイメージです。多分サーバーかと')
	});

	// 起動
	startUp();

	// windowリサイズ
	$(window).on('resize', function() {
		if (selectJsonData) {
			drawChart();
		}
	});
});