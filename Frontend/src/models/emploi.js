class Emploi {
    constructor(
      employe_id, heure_depart, heure_arrivee, pause_debut, pause_fin, jour
    ) {
      this.employe_id = employe_id;
      this.heure_depart = heure_depart;
      this.heure_arrivee = heure_arrivee;
      this.pause_debut = pause_debut;
      this.pause_fin = pause_fin;
      this.jour = jour;
    }
  }
  
  export default Emploi;  