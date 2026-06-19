const { BlobServiceClient } = require('@azure/storage-blob');

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const AZURE_STORAGE_CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME;

if (!AZURE_STORAGE_CONNECTION_STRING) {
  console.warn("AZURE_STORAGE_CONNECTION_STRING is missing in environment variables.");
}

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING || "DefaultEndpointsProtocol=https;AccountName=placeholder;AccountKey=placeholder;EndpointSuffix=core.windows.net");
const containerClient = blobServiceClient.getContainerClient(AZURE_STORAGE_CONTAINER_NAME || "cloudvault");

module.exports = {
  blobServiceClient,
  containerClient,
  AZURE_STORAGE_CONTAINER_NAME
};
