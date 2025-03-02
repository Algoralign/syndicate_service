SYNDICATE_IMAGE := biostech/syndicate-service:1.0.0

# Only build image and run
build_syndicate_service:
	cd ./ && docker build --no-cache -f Dockerfile -t $(SYNDICATE_IMAGE) . && docker compose up

# Build, Run & Push Image
build_push_build_syndicate_service:
	cd ./ && docker build --no-cache -f Dockerfile -t $(SYNDICATE_IMAGE) . && docker push $(SYNDICATE_IMAGE)

# Only push image to docker
push_project_donor:
	cd ./ && docker push $(SYNDICATE_IMAGE)




	