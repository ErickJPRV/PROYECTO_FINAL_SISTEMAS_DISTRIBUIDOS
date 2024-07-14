import express from 'express';
import path from 'path';
import multer from 'multer';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDcR3EvHymzKMqtKLgH2gioGRfqjPEpvpo",
  authDomain: "sistemas-distribuidos-86ecf.firebaseapp.com",
  projectId: "sistemas-distribuidos-86ecf",
  storageBucket: "sistemas-distribuidos-86ecf.appspot.com",
  messaging