import jinja2
from pylatex import Document
from pylatex.utils import NoEscape

data = {
    "mois": "Mars",
    "annee": "2025",
    "nom": "John Doe",
    "situationFamiliale": "Célibataire",
    "cnss": "0065113672",
    "matricule": "123456",
    "createdAt": "01/01/2020",
    "salaireContrat": "3000.00",
    "serviceNom": "Développement",
    "departementNom": "IT",
    "ribBancaire": "1234 5678 9101 1121",
    "jourTotal": "22",
    "jourFerie": "2",
    "jourConge": "1",
    "jourAbcense": "0",
    "soldeConge": "10",
    "nbJourBase": "22",
    "salaireBase": "3000.00",
    "primePresence": "200.00",
    "primeTransport": "100.00",
    "salaireBrut": "3300.00",
    "retenueCNSS": "320.00",
    "salaireImposable": "2980.00",
    "appointPlus": "150.00",
    "acompte": "0.00",
    "impoRev": "50.00",
    "appointMoins": "0.00",
    "CSS": "30.00",
    "salaireNet": "2600.00",
    "modePaiment": "Virement Bancaire"
}

template_loader = jinja2.FileSystemLoader(searchpath="./")
template_env = jinja2.Environment(loader=template_loader)
template = template_env.get_template("fichedepaie.tex")

rendered_tex = template.render(data)

doc = Document()

doc.dumps = lambda: rendered_tex

doc.generate_pdf("output", clean_tex=True, compiler="pdflatex")

print("PDF generated successfully!")

#gotta install texlive and texlive-collection-langfrench