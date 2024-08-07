create database Proyecto
go
use master
drop database Proyecto
use Proyecto

create table Mensajes(
id_mensaje int not null primary key identity(1,1),
mensaje text,
usuario1 int not null,
usuario2 int not null,
fecha_mensaje date not null,
)
drop table mensajes

alter table Mensajes add constraint FK_Mensaje_trabajador1
foreign key (usuario1) references Trabajador(id_Trabajador)

alter table Mensajes add constraint FK_Mensaje_trabajador2
foreign key (usuario2) references Trabajador(id_Trabajador)

select * from Mensajes

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

use Proyecto;
alter table Trabajador add ImageUrl NVARCHAR(MAX);
select * from Trabajador
Insert into Trabajador(id_Trabajador,Nombres,Apellidos,Cargo,Contraseña,Correo_Electronico,ImageUrl)
values (78536824,'Honorio','Apaza','Administrador','159','Honorio@unam.edu.pe',null)

Create login Administrador with password='Admin2024@unam'
create user Administrador from LOGIN Administrador

Alter role db_datawriter add member Administrador
Alter role db_datareader add member Administrador-- Asegúrate de que las columnas necesarias existan y si no, añádelas
select * from Messages
drop table Messages
CREATE TABLE Messages (
    message_id INT IDENTITY(1,1) PRIMARY KEY,
    conversation_id INT NOT NULL,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message NVARCHAR(MAX) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (conversation_id) REFERENCES Conversations(conversation_id),
    FOREIGN KEY (sender_id) REFERENCES Trabajador(id_Trabajador),  -- Asegúrate de que esta referencia sea correcta
    FOREIGN KEY (receiver_id) REFERENCES Trabajador(id_Trabajador)  -- Asegúrate de que esta referencia sea correcta
)

SELECT p1.conversation_id
                FROM Participants p1
                JOIN Participants p2 ON p1.conversation_id = p2.conversation_id
                WHERE p1.user_id = 75530659  AND p2.user_id = 71234595
                GROUP BY p1.conversation_id
                HAVING COUNT(DISTINCT p1.user_id) = 2