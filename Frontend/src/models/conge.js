class Conge {
  constructor(id = null, employe_id = null, type_conge = "", start_date = "", end_date = "", status = "", notes = "") {
    this.id = id;
    this.matricule = employe_id;
    this.type_conge = type_conge;
    this.start_date = start_date;
    this.end_date = end_date;
    this.status = status;
    this.notes = notes;
  }
}

export default Conge;
