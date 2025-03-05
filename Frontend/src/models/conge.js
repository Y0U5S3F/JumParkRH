class Conge {
  constructor(id = null, employe_id = null, type_conge = "", startDate = "", endDate = "", status = "", notes = "") {
    this.id = id;
    this.employe = employe_id;
    this.typeconge = type_conge;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
    this.notes = notes;
  }
}

export default Conge;
