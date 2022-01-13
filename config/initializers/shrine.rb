require "shrine"
require "shrine/storage/file_system"
require "shrine/storage/s3"

if Rails.env.test?
  Shrine.storages = {
    cache: Shrine::Storage::FileSystem.new("public", prefix: "uploads/cache"), # temporary
    store: Shrine::Storage::FileSystem.new("public", prefix: "uploads") # permanent
  }
else
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
  Shrine.plugin :uppy_s3_multipart # adds support for s3 multipart uploads
end

Shrine.plugin :determine_mime_type
Shrine.plugin :activerecord # loads Active Record integration
Shrine.plugin :cached_attachment_data # enables retaining cached file across form redisplays
Shrine.plugin :restore_cached_data # extracts metadata for assigned cached files
Shrine.plugin :derivatives # allows having different size classes for images
Shrine.plugin :remove_invalid # remove uploads that failed validation
