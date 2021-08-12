require "shrine"
require "shrine/storage/file_system"
require "shrine/storage/s3"

s3_options = {
  bucket: "talentprotocol-mvp",
  region: "eu-west-2",
  access_key_id: ENV.fetch("AWS_ACCESS_KEY_ID"),
  secret_access_key: ENV.fetch("AWS_SECRET_ACCESS_KEY")
}

if Rails.env.development?
  s3_options[:bucket] = "talentprotocol-development"
end

Shrine.storages = {
  cache: Shrine::Storage::S3.new(
    prefix: "cache",
    **s3_options
  ),
  store: Shrine::Storage::S3.new(
    **s3_options
  )
}

Shrine.plugin :determine_mime_type
Shrine.plugin :activerecord # loads Active Record integration
Shrine.plugin :cached_attachment_data # enables retaining cached file across form redisplays
Shrine.plugin :restore_cached_data # extracts metadata for assigned cached files
Shrine.plugin :uppy_s3_multipart # adds support for s3 multipart uploads
