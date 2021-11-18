window.onload = function () {
    let buttonElement = document.createElement('BUTTON'),
        textAreaElement = document.createElement('TEXTAREA'),
        linkElement = document.createElement("A"),
        linkText = document.createTextNode("Retour à la liste des signatures");

    linkElement.setAttribute('href', "./index.html")
    buttonElement.id = "btn_copy"
    textAreaElement.id = "signature_content"
    buttonElement.innerHTML = "Copier la signature";
    buttonElement.setAttribute('style', "margin: 50px 0 20px;display:block;")
    document.body.appendChild(buttonElement);
    linkElement.appendChild(linkText);
    document.body.appendChild(linkElement);

    let signatureWrapper = document.querySelector('table'),
        btnCopy = document.getElementById("btn_copy"),
        element_html = "<html>" + document.head.outerHTML + "<body>" + signatureWrapper.outerHTML + "</body></html>";

    btnCopy.addEventListener('click', function(e){
        e.stopPropagation();
        copy_content(element_html);
    }, false);


    function copy_content(html, el) {
        var tmpEl;
        if (typeof el !== "undefined") {
            tmpEl = el;
        } else {
            tmpEl = document.createElement("div");
            tmpEl.style.opacity = 0;
            tmpEl.style.position = "absolute";
            tmpEl.style.pointerEvents = "none";
            tmpEl.style.zIndex = -1;
        }
        tmpEl.innerHTML = html;
        document.body.appendChild(tmpEl);
        var range = document.createRange();
        range.selectNode(tmpEl);
        window.clipboardData.clearData ("Text");

        window.getSelection().addRange(range);
        document.execCommand("copy");
        document.body.removeChild(tmpEl);
        alert("Signature copiée au clavier avec succès.");
    }
};