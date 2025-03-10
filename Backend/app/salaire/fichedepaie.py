import jinja2
from pylatex import Document
from pylatex.utils import NoEscape

# Define the data for the template
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

# Set up the Jinja2 environment
template_loader = jinja2.FileSystemLoader(searchpath="./")  # Ensure your template file is here
template_env = jinja2.Environment(loader=template_loader)
template = template_env.get_template("fichedepaie.tex")  # Your complete LaTeX template file

# Render the full LaTeX document (including preamble) with your data
rendered_tex = template.render(data)

# Create a dummy PyLaTeX Document
doc = Document()

# Override the dumps() method so it returns our rendered template
doc.dumps = lambda: rendered_tex

# Generate the PDF; output will be written to output.pdf.
doc.generate_pdf("output", clean_tex=True, compiler="pdflatex")

print("PDF generated successfully!")
