import { IconButton } from "@mui/material";
import {
    DataGrid,
    useGridApiRef,
    DEFAULT_GRID_AUTOSIZE_OPTIONS,
  } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';

const Table = ({employees,})=> {

    const [pageSize, setPageSize] = useState(5);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [expand, setExpand] = useState(DEFAULT_GRID_AUTOSIZE_OPTIONS.expand);
    const apiRef = useGridApiRef();
    
    
    const handleDelete = async (matricule) => {
        try {
          await axios.delete(
            `http://127.0.0.1:8000/api/employe/employes/${matricule}/`
          );
          setEmployees((prev) =>
            prev.filter((employee) => employee.matricule !== matricule)
          );
        } catch (error) {
        }
      };
    const handleView = (employee) => {
        setSelectedEmployee(employee);
        setOpenViewModal(true);
      };
        const handleEdit = (employee) => {
        };
  const autosizeOptions = {
    expand,
  };


    const columns = [
        { field: "matricule", headerName: "Matricule", flex: 1 },
        { field: "nom", headerName: "Nom", flex: 1 },
        { field: "prenom", headerName: "Prénom", flex: 1 },
        { field: "email", headerName: "Email", flex: 2 }, 
        { field: "role", headerName: "Role", flex: 1 },
        { field: "departement", headerName: "Département", flex: 1 },
        { field: "service", headerName: "Service", flex: 1 },
        {
          field: "actions",
          headerName: "Actions",
          flex: 1, 
          renderCell: (params) => (
            <div style={{ display: "flex",}}>
              <IconButton onClick={() => handleView(params.row)}>
                <VisibilityIcon />
              </IconButton>
              <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon /> 
          </IconButton>
              <IconButton onClick={() => handleDelete(params.row.id)}>
                <DeleteIcon />
              </IconButton>
            </div>
          ),
        },
      ];


  return (
    <DataGrid
            apiRef={apiRef}
            rows={employees}
            columns={columns}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            checkboxSelection={false}
            disableRowSelectionOnClick={true}
            disableMultipleRowSelection={true}
            autosizeOptions={autosizeOptions}
          />
  )
}

export default Table
