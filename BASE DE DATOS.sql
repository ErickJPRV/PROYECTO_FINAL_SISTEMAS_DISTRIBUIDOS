create database Proyecto
go
use master
drop database Proyecto
use Proyecto

create table Mensajes(
mensaje text,
id_trabajador_1 int not null,
id_trabajador_2 int not null,
fecha_mensaje date not null,
)

alter table Mensajes add constraint FK_Mensaje_trabajador1
foreign key (id_trabajador_1) references Trabajador(id_Trabajador)

alter table Mensajes add constraint FK_Mensaje_trabajador2
foreign key (id_trabajador_1) references Trabajador(id_Trabajador)

Insert into Trabajador(id_trabajador,Nombres,Apellidos,Cargo,Contraseña) values(75530659,'Erick Jean Pier','Ramos Vera','Empleado','123$')

create table Trabajador(
id_Trabajador int Primary key constraint PK_trabajador not null,
Nombres varchar(50) not null,
Apellidos varchar(50) not null,
Cargo varchar(50) not null,
Contraseña varchar(50) not null,
)

Create table Eventos(
Id_evento int identity(1,1) Primary key constraint PK_evento not null,
Nombre_evento varchar(50),
Descripcion_evento text,
)

CREATE TABLE Documentos (
    DocumentoID INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(255) NOT NULL,
    Tipo NVARCHAR(50) NOT NULL,
    Contenido VARBINARY(MAX) NOT NULL,
    FechaSubida DATETIME NOT NULL DEFAULT GETDATE(),
    UsuarioID INT
);

alter table Documentos add constraint FK_Documentos_trabajador
foreign key (UsuarioID) references Trabajador(id_Trabajador)

Create login Empleado with password='EPISI@Ilo2024'
create user Trabajador from LOGIN Empleado
Alter role db_datareader add member Trabajador
Alter Role db_datawriter add member Trabajador