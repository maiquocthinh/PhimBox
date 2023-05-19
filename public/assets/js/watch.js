const btnReportEpError = document.getElementById('btn-report-ep-error');
if (btnReportEpError)
	btnReportEpError.onclick = function () {
		if (!confirm('Are you sure this episode is error?')) return;
		fetch('/api/report-error-episode', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ episodeId: window.app.currentEpId }),
		})
			.then(function (response) {
				response.json().then(function (res) {
					alert(res.message);
				});
			})
			.catch(function (err) {
				alert(err);
			});
	};
