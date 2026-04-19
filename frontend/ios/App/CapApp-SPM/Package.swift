// swift-tools-version: 5.9
import PackageDescription

// DO NOT MODIFY THIS FILE - managed by Capacitor CLI commands
let package = Package(
    name: "CapApp-SPM",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "CapApp-SPM",
            targets: ["CapApp-SPM"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", exact: "8.3.0"),
        .package(name: "CapacitorBarcodeScanner", path: "../../../node_modules/@capacitor/barcode-scanner"),
<<<<<<< Updated upstream
        .package(name: "CapacitorBrowser", path: "../../../node_modules/@capacitor/browser"),
        .package(name: "CapacitorPreferences", path: "../../../node_modules/@capacitor/preferences"),
        .package(name: "CapacitorStatusBar", path: "../../../node_modules/@capacitor/status-bar")
=======
        .package(name: "CapacitorPreferences", path: "../../../node_modules/@capacitor/preferences")
>>>>>>> Stashed changes
    ],
    targets: [
        .target(
            name: "CapApp-SPM",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
                .product(name: "CapacitorBarcodeScanner", package: "CapacitorBarcodeScanner"),
<<<<<<< Updated upstream
                .product(name: "CapacitorBrowser", package: "CapacitorBrowser"),
                .product(name: "CapacitorPreferences", package: "CapacitorPreferences"),
                .product(name: "CapacitorStatusBar", package: "CapacitorStatusBar")
=======
                .product(name: "CapacitorPreferences", package: "CapacitorPreferences")
>>>>>>> Stashed changes
            ]
        )
    ]
)
