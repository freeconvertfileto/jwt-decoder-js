(function() {
    var inputEl = document.getElementById('jwtInput');
    var resultsEl = document.getElementById('jwtResults');
    var errorEl = document.getElementById('jwtError');
    var decodeBtn = document.getElementById('jwtDecodeBtn');
    var clearBtn = document.getElementById('jwtClearBtn');
    var expBadge = document.getElementById('jwtExpBadge');
    var headerJson = document.getElementById('jwtHeaderJson');
    var payloadJson = document.getElementById('jwtPayloadJson');
    var signatureVal = document.getElementById('jwtSignatureVal');
    var claimsTable = document.getElementById('jwtClaimsTable');

    function base64urlDecode(str) {
        var s = str.replace(/-/g, '+').replace(/_/g, '/');
        while (s.length % 4 !== 0) { s += '='; }
        try {
            return decodeURIComponent(atob(s).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        } catch (e) {
            return atob(s);
        }
    }

    function prettyJson(obj) {
        return JSON.stringify(obj, null, 2);
    }

    function formatClaimValue(key, val) {
        var timeKeys = ['exp', 'iat', 'nbf'];
        if (timeKeys.indexOf(key) !== -1 && typeof val === 'number') {
            var d = new Date(val * 1000);
            return val + ' (' + d.toUTCString() + ')';
        }
        if (typeof val === 'object' && val !== null) {
            return JSON.stringify(val);
        }
        return String(val);
    }

    function buildClaimsTable(payload) {
        var table = document.createElement('table');
        table.className = 'jwtdec-claims-table';
        var thead = document.createElement('thead');
        var headRow = document.createElement('tr');
        var th1 = document.createElement('th');
        th1.textContent = 'Claim';
        var th2 = document.createElement('th');
        th2.textContent = 'Value';
        headRow.appendChild(th1);
        headRow.appendChild(th2);
        thead.appendChild(headRow);
        table.appendChild(thead);

        var tbody = document.createElement('tbody');
        var keys = Object.keys(payload);
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            var tr = document.createElement('tr');
            var td1 = document.createElement('td');
            td1.textContent = k;
            var td2 = document.createElement('td');
            td2.textContent = formatClaimValue(k, payload[k]);
            tr.appendChild(td1);
            tr.appendChild(td2);
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        return table;
    }

    function decode() {
        if (!inputEl) return;
        var token = inputEl.value.trim();
        if (!token) {
            hide(resultsEl);
            hide(errorEl);
            return;
        }

        var parts = token.split('.');
        if (parts.length !== 3) {
            show(errorEl);
            errorEl.textContent = 'Invalid JWT: expected 3 parts separated by dots.';
            hide(resultsEl);
            return;
        }

        var header, payload;
        try {
            header = JSON.parse(base64urlDecode(parts[0]));
        } catch (e) {
            show(errorEl);
            errorEl.textContent = 'Failed to decode JWT header: ' + e.message;
            hide(resultsEl);
            return;
        }

        try {
            payload = JSON.parse(base64urlDecode(parts[1]));
        } catch (e) {
            show(errorEl);
            errorEl.textContent = 'Failed to decode JWT payload: ' + e.message;
            hide(resultsEl);
            return;
        }

        hide(errorEl);

        headerJson.textContent = prettyJson(header);
        payloadJson.textContent = prettyJson(payload);
        signatureVal.textContent = parts[2];

        var now = Math.floor(Date.now() / 1000);
        if (typeof payload.exp === 'number') {
            if (payload.exp < now) {
                expBadge.textContent = 'Expired';
                expBadge.className = 'jwtdec-exp-badge expired';
            } else {
                expBadge.textContent = 'Valid (not expired)';
                expBadge.className = 'jwtdec-exp-badge valid';
            }
        } else {
            expBadge.textContent = 'No expiry claim';
            expBadge.className = 'jwtdec-exp-badge no-exp';
        }

        claimsTable.innerHTML = '';
        claimsTable.appendChild(buildClaimsTable(payload));

        show(resultsEl);
    }

    function show(el) {
        if (el) el.style.display = '';
    }

    function hide(el) {
        if (el) el.style.display = 'none';
    }

    if (decodeBtn) decodeBtn.addEventListener('click', decode);
    if (inputEl) {
        inputEl.addEventListener('input', decode);
        inputEl.addEventListener('paste', function() {
            setTimeout(decode, 0);
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (inputEl) inputEl.value = '';
            hide(resultsEl);
            hide(errorEl);
        });
    }
})();
