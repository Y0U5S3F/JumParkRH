class LabelData {
    constructor(
      id = "", startDate = "", endDate = "", startPause = "", endPause = "", status = "", label = ""
    ) {
      this.id = id;
      this.startDate = startDate;
      this.endDate = endDate;
      this.startPause = startPause;
      this.endPause = endPause;
      this.status = status;
      this.label = label;
    }
  }
  
  export default LabelData;