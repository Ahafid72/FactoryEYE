 package com.monprojet.factory.controller;

import com.monprojet.factory.entity.CompresseurData;
import com.monprojet.factory.service.CSVService;
import com.monprojet.factory.repository.CompresseurDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "*") // Permet les appels CORS depuis n'importe quel domaine
@RestController
@RequestMapping("/api/compresseur")
public class CSVController {

    @Autowired
    private CSVService csvService;  // Injection de la dépendance CSVService

    @Autowired
    private CompresseurDataRepository compresseurDataRepo;

    // Endpoint pour l'upload du fichier CSV
    @PostMapping("/upload")
    public String uploadCompressorData(@RequestParam("compressorFullData") MultipartFile compressorFullData) throws IOException {
        // Log pour vérifier si le fichier est bien reçu
        if (compressorFullData == null || compressorFullData.isEmpty()) {
            throw new IllegalArgumentException("Le fichier 'compressorFullData' est manquant ou vide.");
        }
        System.out.println("Fichier reçu : " + compressorFullData.getOriginalFilename());

        // Création du fichier temporaire
        File tempFile = File.createTempFile("compressorfulldata", ".csv");
        compressorFullData.transferTo(tempFile);

        // Appel de la méthode d'instance pour importer les données
        csvService.importCompressorData(tempFile);  // Utilisation de l'instance de CSVService

        return "Données du compresseur insérées dans FactoryEYE avec succès !";
    }

    // Endpoint pour récupérer les données du compresseur
    // In your CSVController.java
    @GetMapping("/data")
    public List<CompresseurData> getCompresseurData() {
        return compresseurDataRepo.findAll(); // Make sure this returns the data in the format you need
    }

    // Endpoint pour supprimer toutes les données du compresseur
    @DeleteMapping("/data")
    public String deleteAllCompressorData() {
        compresseurDataRepo.deleteAll();
        return "Toutes les données du compresseur ont été supprimées avec succès.";
    }

    // Endpoint de test
    @GetMapping("/test")
    public String test() {
        return "Le contrôleur fonctionne !";
    }
}
