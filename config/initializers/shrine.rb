require "aws-sdk-cloudfront"
require "shrine"
require "shrine/storage/file_system"
require "shrine/storage/s3"

if Rails.env.test?
  Shrine.storages = {
    cache: Shrine::Storage::FileSystem.new("public", prefix: "uploads/cache"), # temporary
    store: Shrine::Storage::FileSystem.new("public", prefix: "uploads") # permanent
  }
else
  bucket = if ENV["S3_BUCKET"].present?
    ENV["S3_BUCKET"]
  elsif Rails.env.development?
    "talentprotocol-development"
  else
    "talentprotocol-mvp"
  end

  s3_options = {
    bucket: bucket,
    region: "eu-west-2",
    access_key_id: ENV.fetch("AWS_ACCESS_KEY_ID"),
    secret_access_key: ENV.fetch("AWS_SECRET_ACCESS_KEY")
  }

  if ENV["CLOUDFRONT_KEY"].present?
    signer = Aws::CloudFront::UrlSigner.new(
      key_pair_id: ENV["CLOUDFRONT_KEY_ID"],
      private_key: ENV["CLOUDFRONT_KEY"]
    )
    s3_options[:signer] = ->(url, **options) do
      expires = Time.zone.now + 15.minutes
      options = {expires: expires}.merge(options)
      signer.signed_url(url, **options)
    end
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

if ENV["PRIVATE_ASSETS_CDN_HOST"].present?
  url = "https://#{ENV["PRIVATE_ASSETS_CDN_HOST"]}"
  Shrine.plugin :url_options, store: {host: url}
end
