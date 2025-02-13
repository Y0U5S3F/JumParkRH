class Attendance {
    constructor(
      id, employe_id, date, heure_arrivee, heure_depart, pause_debut, pause_fin, 
      status, heures_supplementaires
    ) {
      this.id = id;
      this.employe_id = employe_id;
      this.date = date;
      this.heure_arrivee = heure_arrivee;
      this.heure_depart = heure_depart;
      this.pause_debut = pause_debut;
      this.pause_fin = pause_fin;
      this.status = status;
      this.heures_supplementaires = heures_supplementaires;
    }
  }
  
  export default Attendance;
  